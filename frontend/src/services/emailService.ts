import type { Email, EmailFilter } from "../types/email";
import { APP_CONFIG } from "../constants/config";

const API_BASE_URL = APP_CONFIG.apiBaseUrl;

async function getEmails(
  filter?: EmailFilter
): Promise<Email[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/emails/`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("AUTH_REQUIRED");
    }

    throw new Error(
      `Failed to fetch emails: ${response.status}`
    );
  }

  const data = await response.json();

  let emails: Email[] = data.map((email: any) => ({
    id: email.id,

    sender: {
      name: email.sender_name,
      email: email.sender_email,
      initials: getInitials(email.sender_name),
    },

    recipient: email.recipient,

    subject: email.subject,

    body: email.body,

    snippet:
      email.snippet ||
      email.body?.slice(0, 160) ||
      "",

    timestamp: email.received_at,

    category: email.category,

    priority: email.priority,

    isRead: email.is_read,

    isStarred: email.is_starred,

    isArchived: email.is_archived,

    hasTasks: email.has_tasks,
  }));

  // Inbox view excludes archived messages unless the archive filter is active.
  emails = emails.filter((email) =>
    filter?.archivedOnly ? email.isArchived : !email.isArchived
  );

  if (filter?.category && filter.category !== "All") {
    if (filter.category === "Urgent") {
      emails = emails.filter(
        (email) => email.priority === "urgent" || email.priority === "high"
      );
    } else if (filter.category === "Tasks") {
      emails = emails.filter((email) => email.hasTasks);
    } else {
      emails = emails.filter(
        (email) => email.category === filter.category
      );
    }
  }

  if (filter?.unreadOnly) {
    emails = emails.filter((email) => !email.isRead);
  }

  if (filter?.starredOnly) {
    emails = emails.filter((email) => email.isStarred);
  }

  if (filter?.priorityOnly) {
    emails = emails.filter(
      (email) => email.priority === "urgent" || email.priority === "high"
    );
  }

  if (filter?.searchQuery) {
    const query = filter.searchQuery
      .toLowerCase()
      .trim();

    if (query) {
      emails = emails.filter(
        (email) =>
          email.subject
            .toLowerCase()
            .includes(query) ||
          email.sender.name
            .toLowerCase()
            .includes(query) ||
          email.sender.email
            .toLowerCase()
            .includes(query) ||
          email.snippet
            .toLowerCase()
            .includes(query) ||
          email.body
            .toLowerCase()
            .includes(query)
      );
    }
  }

  return emails;
}

async function getNotifications(): Promise<{
  unreadCount: number;
  notifications: Array<{
    id: string;
    senderName: string;
    subject: string;
    snippet: string;
    receivedAt: string;
    priority: Email["priority"];
  }>;
}> {
  const response = await fetch(
    `${API_BASE_URL}/api/emails/notifications`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("AUTH_REQUIRED");
    }
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }

  const data = await response.json();
  return {
    unreadCount: data.unread_count,
    notifications: data.notifications.map((notification: any) => ({
      id: notification.id,
      senderName: notification.sender_name,
      subject: notification.subject,
      snippet: notification.snippet,
      receivedAt: notification.received_at,
      priority: notification.priority,
    })),
  };
}


async function syncEmails() {
  const response = await fetch(
    `${API_BASE_URL}/api/emails/sync`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("AUTH_REQUIRED");
    }

    const errorResponse = await response.json().catch(() => null);
    const errorDetail =
      typeof errorResponse?.detail === "string"
        ? errorResponse.detail
        : null;

    throw new Error(
      errorDetail || `Gmail sync failed: ${response.status}`
    );
  }

  return response.json();
}


async function markAsRead(
  id: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/emails/${id}/read`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to mark email as read: ${response.status}`
    );
  }
}


async function toggleStar(
  id: string
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/api/emails/${id}/star`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update star: ${response.status}`
    );
  }

  const data = await response.json();

  return data.is_starred;
}


async function archiveEmail(
  id: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/emails/${id}/archive`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to archive email: ${response.status}`
    );
  }
}


async function getEmailById(id: string): Promise<Email | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/emails/${id}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) return null;
    if (response.status === 401) throw new Error("AUTH_REQUIRED");
    throw new Error(`Failed to fetch email: ${response.status}`);
  }

  const email = await response.json();
  return {
    id: email.id,
    sender: {
      name: email.sender_name,
      email: email.sender_email,
      initials: getInitials(email.sender_name),
    },
    recipient: email.recipient,
    subject: email.subject,
    body: email.body,
    snippet: email.snippet || email.body?.slice(0, 160) || "",
    timestamp: email.received_at,
    category: email.category,
    priority: email.priority,
    isRead: email.is_read,
    isStarred: email.is_starred,
    isArchived: email.is_archived,
    hasTasks: email.has_tasks,
  };
}


async function generateDraftReply(id: string): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/emails/${id}/draft-reply`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to generate AI draft reply: ${response.status}`);
  }

  const data = await response.json();
  return data.draft_reply;
}

async function generateSummary(
  id: string
): Promise<{
  category: string;
  priority: string;
  key_takeaways: string[];
  recommended_action: string;
  sentiment: string;
}> {
  const response = await fetch(
    `${API_BASE_URL}/api/emails/${id}/analyze`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `AI analysis failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  return data.analysis;
}


function getInitials(name: string): string {
  if (!name) return "?";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

export const emailService = {
  getEmails,
  getNotifications,
  getEmailById,
  generateDraftReply,
  generateSummary,
  syncEmails,
  markAsRead,
  toggleStar,
  archiveEmail,
};

