
export class Notifications {
  static registerRemoteNotifications(){}
  static events(){return{registerRemoteNotificationsRegistered:()=>({remove:()=>{}}),registerNotificationReceivedForeground:()=>({remove:()=>{}}),registerNotificationOpened:()=>({remove:()=>{}})}}
  static postLocalNotification(){}
  static getInitialNotification(){return Promise.resolve(null)}
}
export class Notification {}

