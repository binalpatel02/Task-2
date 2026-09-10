import { getRedisClient } from "./redis.connection.js";

export const setRedis = async ( key: string, value: string, expiry?: number ) => {

    const client = await getRedisClient();

    if (expiry) {
        await client.set(key, value, {
            EX: expiry
        });
    } else {
        await client.set(key, value);
    }
};


export const getRedis = async ( key: string ) => {

    const client = await getRedisClient();

    return await client.get(key);
};


export const deleteRedis = async ( key: string ) => {

    const client = await getRedisClient();

    return await client.del(key);
};