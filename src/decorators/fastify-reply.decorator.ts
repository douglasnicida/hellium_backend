import { FastifyInstance } from "fastify";
import { CustomReply, HttpCodes } from "../types/fastify.type";

declare module 'fastify' {
  interface FastifyReply {
      customSend<T>(data: any | { message: string }): CustomReply<T>;
  }
}

export function customReplyDecorator(app: FastifyInstance) {
  app.decorateReply("customSend", function <T>
    (this: any, data: any | { message: string; status: HttpCodes }): CustomReply<T> {
    if (data.payload) {
      if (Array.isArray(data.payload.data)) {
        data.message =
          data.payload.data.length == 0
            ? "No items were found."
            : `${data.payload.data.length} items were found.`;
      }
    }

    return {
      status: this.statusCode,
      message: data.message,
      payload: data.payload,
    };
  });
}
