// Simple scheduler for sending daily appointment reminders
// Runs every day at 9:00 AM to send reminders for tomorrow's appointments

const REMINDER_HOUR = 9; // 9 AM
const REMINDER_MINUTE = 0;
const CHECK_INTERVAL_MS = 60 * 1000; // Check every minute

let lastRunDate: string | null = null;

export function startReminderScheduler() {
  console.log('[SCHEDULER] Starting appointment reminder scheduler...');
  console.log(`[SCHEDULER] Will send reminders daily at ${REMINDER_HOUR}:${String(REMINDER_MINUTE).padStart(2, '0')}`);
  
  // Check every minute if it's time to send reminders
  setInterval(async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDate = now.toISOString().split('T')[0];
    
    // Check if it's the right time and we haven't run today
    if (
      currentHour === REMINDER_HOUR && 
      currentMinute === REMINDER_MINUTE &&
      lastRunDate !== currentDate
    ) {
      console.log('[SCHEDULER] Time to send reminders!');
      lastRunDate = currentDate;
      
      try {
        // Call the reminder endpoint
        const response = await fetch(`http://localhost:${process.env.PORT || 5000}/api/send-reminders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        const result = await response.json();
        console.log('[SCHEDULER] Reminder job completed:', result);
      } catch (error) {
        console.error('[SCHEDULER ERROR] Failed to send reminders:', error);
      }
    }
  }, CHECK_INTERVAL_MS);
  
  console.log('[SCHEDULER] Scheduler started successfully');
}

// For manual testing: immediately send reminders
export async function sendRemindersNow() {
  console.log('[SCHEDULER] Manually triggering reminders...');
  try {
    const response = await fetch(`http://localhost:${process.env.PORT || 5000}/api/send-reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const result = await response.json();
    console.log('[SCHEDULER] Manual reminder job completed:', result);
    return result;
  } catch (error) {
    console.error('[SCHEDULER ERROR] Failed to send reminders:', error);
    throw error;
  }
}
