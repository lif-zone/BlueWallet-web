export class Notifications {
  static registerRemoteNotifications(){}
  static events(){return{
    registerRemoteNotificationsRegistered:cb=>({remove:()=>{}}),
    registerRemoteNotificationsRegistrationFailed:cb=>({remove:()=>{}}),
    registerNotificationReceivedForeground:cb=>({remove:()=>{}}),
    registerNotificationReceivedBackground:cb=>({remove:()=>{}}),
    registerNotificationOpened:cb=>({remove:()=>{}}),
  }}
  static postLocalNotification(){}
  static getInitialNotification(){return Promise.resolve(null)}
  static setNotificationChannel(){}
}
export class Notification {}
export const NotificationBackgroundFetchResult = {NEW_DATA:'newData',NO_DATA:'noData',FAILED:'failed'};
export const NotificationCompletion = {ALERT:'alert',SOUND:'sound',BADGE:'badge'};
