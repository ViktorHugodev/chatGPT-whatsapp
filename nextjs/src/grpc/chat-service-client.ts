import { Metadata } from '@grpc/grpc-js'
import { chatClient } from './cliente'
import { ChatServiceClient as GrpcChatServiceClient } from './rpc/pb/ChatService'
import { metadata } from '@/app/layout'

export class ChatServiceClient {
  private authorization = '123456'
  constructor(private chatClient: GrpcChatServiceClient) {}
  chatStream(data: { chat_id?: string | null; user_id: string; message: string }) {
    const metadata = new Metadata()
    console.log('🚀 ~ ChatServiceClient ~ chatStream ~ metadata:', metadata)
    metadata.set('authorization', this.authorization)
    const stream = this.chatClient.chatStream(
      {
        chatId: data.chat_id!,
        userId: data.user_id,
        userMessage: data.message,
      },
      metadata,
    )
    stream.on('data', data => {
      console.log(data)
    })
    stream.on('error', err => {
      console.log(err)
    })
    stream.on('end', () => {
      console.log('end')
    })
    return stream
  }
}

export class ChatServiceClientFactory {
  static create() {
    return new ChatServiceClient(chatClient)
  }
}
