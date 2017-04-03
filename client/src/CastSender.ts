import { SyncNodeEventEmitter } from './SyncNode/SyncNode'

declare var chrome: any;

export class CastSender extends SyncNodeEventEmitter {
  start() {
    console.log('hereeeeee1')

    let applicationID = '6964F1A3';
    let namespace = 'urn:x-cast:jkalweit.signs';
    let session: any = null;

    console.log('here1')
    if (!chrome.cast || !chrome.cast.isAvailable) {
      console.log('here2')
      setTimeout(initializeCastApi, 1000);
    }

    function initializeCastApi() {
      console.log('here3')
      var sessionRequest = new chrome.cast.SessionRequest(applicationID);
      var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
        sessionListener,
        receiverListener);

      chrome.cast.initialize(apiConfig, onInitSuccess, onError);
    }

    function onInitSuccess() {
      console.log('onInitSuccess');
    }

    function onError(message: any) {
      console.log('onError: ' + JSON.stringify(message));
    }

    function onSuccess(message: any) {
      console.log('onSuccess: ' + message);
    }

    function onStopAppSuccess() {
      console.log('onStopAppSuccess');
    }

    function sessionListener(e: any) {
      console.log('New session ID:' + e.sessionId);
      session = e;
      session.addUpdateListener(sessionUpdateListener);
      session.addMessageListener(namespace, receiverMessage);
    }

    function sessionUpdateListener(isAlive: boolean) {
      var message = isAlive ? 'Session Updated' : 'Session Removed';
      message += ': ' + session.sessionId;
      console.log(message);
      if (!isAlive) {
        session = null;
      }
    }

    function receiverMessage(namespace: string, message: string) {
      console.log('receiverMessage: ' + namespace + ', ' + message);
    }

    function receiverListener(e: string) {
      if (e === 'available') {
        console.log('receiver found');
      }
      else {
        console.log('receiver list empty');
      }
    }


    /**
     * send a message to the receiver using the custom namespace
     * receiver CastMessageBus message handler will be invoked
     * @param {string} message A message string
     */
    function sendMessage(message: string) {
      if (session != null) {
        session.sendMessage(namespace, message, onSuccess.bind(this, 'Message sent: ' + message),
          onError);
      }
      else {
        chrome.cast.requestSession(function (e: any) {
          session = e;
          session.sendMessage(namespace, message, onSuccess.bind(this, 'Message sent: ' +
            message), onError);
        }, onError);
      }
    }
  }
}