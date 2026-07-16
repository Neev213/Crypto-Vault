import fs from "fs";
import path from "path";

const clientDist = path.join(process.cwd(), "client", "dist");
const targets = ["dist", "public"];

if (fs.existsSync(clientDist)) {
    for (const target of targets) {
        const targetDir = path.join(process.cwd(), target);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.cpSync(clientDist, targetDir, { recursive: true });
        console.log(`Copied client/dist to ${target}`);
    }
} else {
    console.warn("client/dist not found, skipping copy");
}
