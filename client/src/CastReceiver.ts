import { SyncNodeEventEmitter } from './SyncNode/SyncNode'

declare var cast: any;
declare var castReceiverManager: any;

declare global {
    interface Window {
        castReceiverManager: any;
        messageBus: any;
    }
}

export class CastReceiver extends SyncNodeEventEmitter {
    start() {

      window.onload = function() {
        cast.receiver.logger.setLevelValue(0);
        window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
        console.log('Starting Receiver Manager');

        castReceiverManager.onReady = function(event: any) {
          console.log('Received Ready event: ' + JSON.stringify(event.data));
          window.castReceiverManager.setApplicationState('Application status is ready...');
        };

        castReceiverManager.onSenderConnected = function(event: any) {
          console.log('Received Sender Connected event: ' + event.data);
          console.log(window.castReceiverManager.getSender(event.data).userAgent);
        };

        castReceiverManager.onSenderDisconnected = function(event: any) {
          console.log('Received Sender Disconnected event: ' + event.data);
          if (window.castReceiverManager.getSenders().length == 0) {
            window.close();
          }
        };

        // create a CastMessageBus to handle messages for a custom namespace
        window.messageBus =
          window.castReceiverManager.getCastMessageBus(
              'urn:x-cast:jkalweit.signs');

        // handler for the CastMessageBus message event
        window.messageBus.onMessage = function(event: any) {
          console.log('Message [' + event.senderId + ']: ' + event.data);
          this.emit('message', event);
          // inform all senders on the CastMessageBus of the incoming message event
          // sender message listener will be invoked
          window.messageBus.send(event.senderId, event.data);
        }

        // initialize the CastReceiverManager with an application status message
        window.castReceiverManager.start({statusText: 'Application is starting'});
        console.log('Receiver Manager started');
      };
    }
}