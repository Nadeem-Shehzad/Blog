import Redis from "ioredis";

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
    if (!redisClient) {
        redisClient = new Redis();

        redisClient.on("connect", () => {
            console.log("Connected to Redis");
        });

        redisClient.on("error", (error) => {
            console.error("Redis Client Error:", error);
        });
    }
    return redisClient;
}


export const closeRedisClient = async (): Promise<void> => {
    if (redisClient) {
        try {
            await redisClient.quit(); 
            console.log("Redis connection closed.");
        } catch (error) {
            console.error("Error closing Redis:", error);
        } finally {
            redisClient = null;
        }
    }
};