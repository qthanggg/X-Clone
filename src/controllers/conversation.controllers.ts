import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import conversationService from '~/services/conversation.services'

export const getConversationController = async (req: Request, res: Response) => {
  const { receiverId } = req.params
  const sender_id = req.decoded_authorization?.user_id as string
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const result = await conversationService.getConversations({
    sender_id,
    receiver_id: receiverId,
    limit,
    page
  })
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
