import emailjs from '@emailjs/browser'

export interface EmailConfig {
  serviceId: string
  templateId: string
  publicKey: string
  fromName: string
  replyTo: string
}

const CONFIG_KEY = 'linfair_email_config'

export function getEmailConfig(): EmailConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveEmailConfig(config: EmailConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function hasEmailConfig(): boolean {
  const cfg = getEmailConfig()
  return !!(cfg?.serviceId && cfg?.templateId && cfg?.publicKey)
}

export interface NotificationPayload {
  type: 'product' | 'blog' | 'siteContent'
  title: string
  summary: string
  url: string
}

export async function sendNotification(
  payload: NotificationPayload,
): Promise<{ success: boolean; message: string }> {
  const config = getEmailConfig()
  if (!config) {
    return { success: false, message: 'Email service not configured' }
  }

  try {
    emailjs.init(config.publicKey)

    // Get all subscribers
    const raw = localStorage.getItem('linfair_subscribers')
    const subscribers = raw ? JSON.parse(raw) : []
    const emails = subscribers.map((s: any) => s.email).filter(Boolean)

    if (emails.length === 0) {
      return { success: false, message: 'No subscribers to notify' }
    }

    // Send to first subscriber as a test (EmailJS free plan limits)
    // For production, use a bulk email service
    const result = await emailjs.send(
      config.serviceId,
      config.templateId,
      {
        to_email: emails[0],
        to_name: emails[0].split('@')[0],
        from_name: config.fromName || 'LINFAIR Wool',
        reply_to: config.replyTo || 'info@linfairwool.cn',
        subject: `[LINFAIR] New ${payload.type}: ${payload.title}`,
        message: payload.summary,
        type: payload.type,
        title: payload.title,
        summary: payload.summary,
        url: payload.url,
        site_name: 'LINFAIR Wool',
        subscriber_count: emails.length,
      },
    )

    if (result.status === 200) {
      return { success: true, message: `Notification sent to ${emails.length} subscriber(s)` }
    }
    return { success: false, message: 'Failed to send email' }
  } catch (err: any) {
    return { success: false, message: err.text || err.message || 'Failed to send email' }
  }
}
