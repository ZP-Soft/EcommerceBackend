export class ResultModel {

  constructor(statusCode, messageToShow, body, internalErrorMessage, source ) {
    let error = String(internalErrorMessage).replace(/'/g, '"')
    this.statusCode = statusCode || null,    
    this.messageToShow = messageToShow || null,
    this.body = body || null,
    this.internalErrorMessage = error || null,
    this.source = source || null
  };

}