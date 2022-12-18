import type { DefaultEventsMap } from '@socket.io/component-emitter';
import { io, Socket } from 'socket.io-client'

import { useNotification } from '@kyvg/vue3-notification';


// const { notify}  = useNotification()
// const displayNotification = ((event: any) => {
//     console.log(event);
//     notify({
//           title: 'Server Update',
//           text: event,
//           duration: -1,
//           type: 'info'
//         });
//   })

class SocketIOService {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    constructor() {
        this.socket = io('http://localhost:3000')
    }
    setupSocketConnection(callback: any) {
        //this.socket = io('http://localhost:3000')
        this.socket.on('msgToClient', callback)
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

}

export default new SocketIOService()