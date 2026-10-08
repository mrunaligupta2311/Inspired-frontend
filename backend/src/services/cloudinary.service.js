const https = require("https");
const crypto = require("crypto");

const uploadToCloudinary = (buffer, resourceType) => {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("[AI Studio] Cloudinary credentials not configured — returning in-memory data URL fallback.");
      const mime = resourceType === "video" ? "video/mp4" : "image/png";
      return resolve({
        secure_url: `data:${mime};base64,${buffer.toString("base64")}`,
        public_id: `local-mock-${Date.now()}`,
        resource_type: resourceType,
        format: resourceType === "video" ? "mp4" : "png",
        bytes: buffer.length,
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "inspired-institute/gallery";

    const signature = crypto
      .createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const boundary = `----CloudinaryBoundary${Date.now()}`;
    const parts = [];

    const addField = (name, value) => {
      parts.push(
        Buffer.from(
          `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="${name}"\r\n\r\n` +
            `${value}\r\n`
        )
      );
    };

    addField("api_key", apiKey);
    addField("timestamp", timestamp);
    addField("folder", folder);
    addField("signature", signature);

    parts.push(
      Buffer.from(
        `--${boundary}\r\n` +
          `Content-Disposition: form-data; name="file"; filename="gallery-media"\r\n` +
          `Content-Type: application/octet-stream\r\n\r\n`
      )
    );

    parts.push(buffer);
    parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

    const body = Buffer.concat(parts);

    const request = https.request(
      {
        hostname: "api.cloudinary.com",
        path: `/v1_1/${cloudName}/${resourceType}/upload`,
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": body.length,
        },
      },
      (response) => {
        let responseData = "";

        response.on("data", (chunk) => {
          responseData += chunk;
        });

        response.on("end", () => {
          let data;

          try {
            data = JSON.parse(responseData);
          } catch {
            return reject(
              new Error("Invalid response received from Cloudinary")
            );
          }

          if (response.statusCode < 200 || response.statusCode >= 300) {
            const error = new Error(
              data?.error?.message || "Cloudinary upload failed"
            );
            error.statusCode = response.statusCode;
            return reject(error);
          }

          resolve(data);
        });
      }
    );

    request.on("error", reject);
    request.end(body);
  });
};

const deleteFromCloudinary = async (publicId, resourceType) => {
  if (!publicId) return null;

  return new Promise((resolve, reject) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const timestamp = Math.floor(Date.now() / 1000);

    const signature = crypto
      .createHash("sha1")
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const params = new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: apiKey,
      signature,
    }).toString();

    const request = https.request(
      {
        hostname: "api.cloudinary.com",
        path: `/v1_1/${cloudName}/resources/${resourceType}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(params),
        },
      },
      (response) => {
        let responseData = "";

        response.on("data", (chunk) => {
          responseData += chunk;
        });

        response.on("end", () => {
          let data;

          try {
            data = JSON.parse(responseData);
          } catch {
            return reject(
              new Error("Invalid response received from Cloudinary")
            );
          }

          if (response.statusCode < 200 || response.statusCode >= 300) {
            const error = new Error(
              data?.error?.message || "Cloudinary delete failed"
            );
            error.statusCode = response.statusCode;
            return reject(error);
          }

          resolve(data);
        });
      }
    );

    request.on("error", reject);
    request.write(params);
    request.end();
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
