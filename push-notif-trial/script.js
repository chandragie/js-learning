const pushButton = document.getElementById('enable-push-btn');
const applicationServerPublicKey = 'BLNbq7S7ppwDQWtHOBbBy5ZNxNAYofKNUXbam2E-n6c1Dj5i3kznDgycRA2LQwGd7wS6efU8KMOtKBm-M6E5HLQ'
let sw = null;
let isSubscribed = false;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function checkSubscription() {
    pushButton.addEventListener('click', () => {
        pushButton.disabled = true;
        if (isSubscribed) {
            //unsubscribe user
        } else {
            subscribeUser();
        }
    })

    sw.pushManager.getSubscription().then(function (subs) {
        isSubscribed = !(subs === null)

        if (isSubscribed) {
            console.log('this user is already subscribed');
        } else {
            console.log('this user is NOT subscribed');
        }

        updateButton();
    })

}

function updateButton() {

    //handle permission denied
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push blocked'
        pushButton.disabled = false
        updateSubscriptionOnServer(null)
        return
    }

    if (isSubscribed) {
        pushButton.textContent = 'Disable Push';
    } else {
        pushButton.textContent = 'Enable Push';
    }
    pushButton.disabled = false;
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    }).then((subscription) => {
        console.log('user is subscribed');
        updateSubscriptionOnServer(subscription);
        isSubscribed = true;
        updateButton();
    }).catch(err => {
        console.log(err);
        updateButton()
    })
}

function updateSubscriptionOnServer(subscription) {
    //send subscription to server

    const subscribtionJson = document.querySelector('.js-subscription-json')
    const subscriptionDetails = document.querySelector('.js-subscription-details')

    if (subscription) {
        subscribtionJson.textContent = JSON.stringify(subscription)
        subscriptionDetails.classList.remove('invisible')
    } else {
        subscriptionDetails.classList.add('invisible')
    }
}

if ('serviceWorker' in navigator) {
    console.log('ada service worker');
    if ('PushManager' in window) {
        console.log('ada push manager');
        navigator.serviceWorker.register('ServiceWorker.js').then((registration) => {
            sw = registration;
            checkSubscription();
        }).catch(err => {
            console.log(err);
        })
    } else {
        console.log('push manager nggak ada');
    }
} else {
    console.log('service worker nggak ada');
}