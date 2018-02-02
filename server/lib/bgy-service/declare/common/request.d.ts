/// <reference types="node" />
import * as https from 'https';
import { IncomingMessage } from 'http';
/** 向考勤系统发送请求 */
export default function ({headers, ...opts}: https.RequestOptions, body?: string): Promise<IncomingMessage>;
/** 获取服务端响应的内容 */
export declare function getContent(response: IncomingMessage): Promise<string>;
/** 将服务端响应内容转换为 JSON 对象 */
export declare function getObject<T>(response: IncomingMessage): Promise<T>;
