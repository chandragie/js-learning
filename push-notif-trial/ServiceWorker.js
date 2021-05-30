'use strict';

//handle push
self.addEventListener('push', (event) => {
    console.log('[SW] push received');
    console.log(`[SW] push had this data : "${event.data.text()}"`);

    const title = 'Berhasil cuk!!'
    const options = {
        body: event.data.text(),
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    }

    event.waitUntil(self.registration.showNotification(title, options));
})

//handle click on notif pop up
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] notification is being clicked!');

    event.notification.close()

    event.waitUntil(clients.openWindow('https://developers.google.com/web/'))
})