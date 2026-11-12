export const enum HapticFeedbackTypes {
  ImpactLight = 'impactLight',
  ImpactMedium = 'impactMedium',
  ImpactHeavy = 'impactHeavy',
  Selection = 'selection',
  NotificationSuccess = 'notificationSuccess',
  NotificationWarning = 'notificationWarning',
  NotificationError = 'notificationError',
}

const triggerHapticFeedback = (_type: HapticFeedbackTypes)=>{};

export const triggerSuccessHapticFeedback = ()=>{};
export const triggerWarningHapticFeedback = ()=>{};
export const triggerErrorHapticFeedback = ()=>{};
export const triggerSelectionHapticFeedback = ()=>{};

export default triggerHapticFeedback;
