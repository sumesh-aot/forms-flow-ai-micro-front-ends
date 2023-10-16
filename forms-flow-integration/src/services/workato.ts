/* istanbul ignore file */
import { RequestService } from "@formsflow/service";

import API from "../endpoints/index";

export interface TokenResponse {
    token: string;
}
  

export const getEmbedToken = (callback, errorHandler) => {

    RequestService.httpPOSTRequest(API.GET_EMBED_TOKEN, {})
      .then((res) => {
        if (res.data) {
          callback(res.data);
        } else {
        errorHandler("Error generating token!")
        }
      })
      .catch((error) => {
        errorHandler(error?.message)
      });

};
