import { ParamsDictionary } from 'express-serve-static-core'
export interface getConversationParam extends ParamsDictionary {
  receiver_id: string
}
