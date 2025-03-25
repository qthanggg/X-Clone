import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import conversationService from '~/services/conversation.services'
import { getConversationParam } from '~/models/request/Conversation.request'

export const getConversationController = async (req: Request<getConversationParam>, res: Response) => {
  const { receiver_id } = req.params
  const sender_id = req.decoded_authorization?.user_id as string

  // console.log('receiver_id', receiver_id)
  // console.log('sender_id', sender_id)
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const result = await conversationService.getConversations({
    sender_id,
    receiver_id: receiver_id,
    limit,
    page
  })
  //console.log('result11111', result)
  res.json({
    messsage: 'get success',
    result: {
      data: result.conversation,
      limit,
      page,
      total_pagfe: Math.ceil(result.total / limit)
    }
  })
}
