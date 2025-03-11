export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
export enum MediaType {
  Image,
  Video,
  HLS
}
export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}
export enum EncodingStatus {
  Pending,
  Processing,
  Success,
  Failed
}
export enum TweetType {
  Tweet,
  Retweet, // phai la chuoi rong
  Comment,
  QuoteTweet
}
export enum TweetAudience {
  Public,
  TwitterCircle
}
