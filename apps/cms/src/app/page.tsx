'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  UserProfile,
  Video,
  VideoCategory,
  WelcomeGift,
  MemberGift,
  NotificationCampaign,
  CampaignLocation,
  Feedback,
  SanitizedMemberProfile,
  AuditEvent,
} from '@ilc/shared';

export default function CMSDashboard() {
  // --- AUTH STATE ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string>('');
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('admin@islandlivingchannel.tv');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // --- NAVIGATION ---
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'vod' | 'gifts' | 'notifications' | 'locations' | 'feedback' | 'members' | 'settings'
  >('dashboard');

  // --- DATA STATES ---
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [vodFilterStatus, setVodFilterStatus] = useState<string>('all');
  const [vodFilterCategory, setVodFilterCategory] = useState<string>('');
  const [vodSearch, setVodSearch] = useState<string>('');

  const [welcomeGifts, setWelcomeGifts] = useState<WelcomeGift[]>([]);
  const [memberGifts, setMemberGifts] = useState<Array<MemberGift & { gift?: WelcomeGift; user_display_name?: string }>>([]);
  const [giftViewMode, setGiftViewMode] = useState<'catalog' | 'issued'>('catalog');

  const [notifications, setNotifications] = useState<NotificationCampaign[]>([]);
  const [locations, setLocations] = useState<CampaignLocation[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [feedbackFilterStatus, setFeedbackFilterStatus] = useState<string>('all');
  const [members, setMembers] = useState<SanitizedMemberProfile[]>([]);
  const [memberSearch, setMemberSearch] = useState<string>('');
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  // --- MODALS & WORKFLOWS ---
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Islands & Beaches');
  const [uploadTags, setUploadTags] = useState('Palawan, Beaches');
  const [uploadStatus, setUploadStatus] = useState<'published' | 'draft'>('published');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [isAddGiftModalOpen, setIsAddGiftModalOpen] = useState(false);
  const [giftTitle, setGiftTitle] = useState('');
  const [giftDescription, setGiftDescription] = useState('');
  const [giftValidityDays, setGiftValidityDays] = useState(30);
  const [giftInstructions, setGiftInstructions] = useState('');
  const [giftNewMemberOnly, setGiftNewMemberOnly] = useState(true);

  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [campaignDeepLink, setCampaignDeepLink] = useState('');
  const [confirmBroadcastCampaign, setConfirmBroadcastCampaign] = useState<NotificationCampaign | null>(null);

  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [locName, setLocName] = useState('');
  const [locLat, setLocLat] = useState('11.9592');
  const [locLng, setLocLng] = useState('121.9272');
  const [locRadius, setLocRadius] = useState(800);

  const [feedbackModalItem, setFeedbackModalItem] = useState<Feedback | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Check auth session on load
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Login failed');
        return;
      }
      setUser(data.user);
      setToken(data.token);
      showToast(`Welcome back, ${data.user.display_name}!`);
      loadAllData();
    } catch (err: any) {
      setLoginError(err.message || 'Network error');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'POST' });
    setUser(null);
    setToken('');
    showToast('Signed out successfully.');
  };

  const loadAllData = async () => {
    fetchVideos();
    fetchGifts();
    fetchNotifications();
    fetchLocations();
    fetchFeedback();
    fetchMembers();
    fetchSettings();
    fetchAudit();
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos?status=all');
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos);
        if (data.categories) setCategories(data.categories);
      }
    } catch (e) {
      console.error('Error fetching videos:', e);
    }
  };

  const fetchGifts = async () => {
    try {
      const res = await fetch('/api/gifts');
      const data = await res.json();
      if (data.success) setWelcomeGifts(data.gifts);

      const mRes = await fetch('/api/member-gifts?all=true');
      const mData = await mRes.json();
      if (mData.success) setMemberGifts(mData.member_gifts);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/campaigns/notifications');
      const data = await res.json();
      if (data.success) setNotifications(data.campaigns);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/campaigns/locations');
      const data = await res.json();
      if (data.success) setLocations(data.locations);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success) setFeedbackList(data.feedback);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.success) setMembers(data.members);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) setSettings(data.settings);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAudit = async () => {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.success) setAuditEvents(data.audit_events);
    } catch (e) {
      console.error(e);
    }
  };

  // --- VOD WORKFLOWS ---
  const handleTogglePublish = async (video: Video) => {
    const nextStatus = video.status === 'published' ? 'unpublished' : 'published';
    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Video status changed to ${nextStatus}. Visible in mobile feed!`);
        fetchVideos();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Video removed.');
        fetchVideos();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVideoUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      setUploadError('Title is required');
      return;
    }
    setUploadError('');
    setIsUploading(true);
    setUploadProgress(15);

    try {
      let mediaPath = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      let thumbnailPath = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop';

      // If user provided a video file, upload directly to /api/upload
      if (uploadFile) {
        setUploadProgress(35);
        const videoFormData = new FormData();
        videoFormData.append('file', uploadFile);
        const upRes = await fetch('/api/upload', {
          method: 'POST',
          body: videoFormData,
        });
        const upData = await upRes.json();
        if (!upRes.ok) throw new Error(upData.error || 'Video upload failed');
        mediaPath = upData.url;
        setUploadProgress(70);
      }

      // If user provided thumbnail
      if (thumbnailFile) {
        const thumbFormData = new FormData();
        thumbFormData.append('file', thumbnailFile);
        const thumbRes = await fetch('/api/upload', {
          method: 'POST',
          body: thumbFormData,
        });
        const thumbData = await thumbRes.json();
        if (thumbRes.ok) {
          thumbnailPath = thumbData.url;
        }
      }

      setUploadProgress(90);

      // Create video record
      const tagArray = uploadTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          description: uploadDescription || 'Island Living Channel travel feature.',
          media_path: mediaPath,
          thumbnail_path: thumbnailPath,
          status: uploadStatus,
          is_featured: false,
          categories: [uploadCategory],
          tags: tagArray,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save video metadata');

      setUploadProgress(100);
      showToast(`Success! Video "${uploadTitle}" is ${uploadStatus} and ready on Mobile.`);
      setIsUploadModalOpen(false);
      resetUploadForm();
      fetchVideos();
      fetchAudit();
    } catch (err: any) {
      setUploadError(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setThumbnailFile(null);
    setUploadTitle('');
    setUploadDescription('');
    setUploadProgress(0);
    setUploadError('');
  };

  // --- WELCOME GIFTS WORKFLOW ---
  const handleCreateGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftTitle || !giftDescription) return;
    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: giftTitle,
          description: giftDescription,
          validity_days: Number(giftValidityDays),
          redemption_instructions: giftInstructions || 'Present QR card to partner desk.',
          new_member_only: giftNewMemberOnly,
          is_active: true,
        }),
      });
      if (res.ok) {
        showToast('Welcome gift campaign created!');
        setIsAddGiftModalOpen(false);
        setGiftTitle('');
        setGiftDescription('');
        fetchGifts();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- NOTIFICATIONS BROADCAST WORKFLOW ---
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle || !campaignMessage) return;
    try {
      const res = await fetch('/api/campaigns/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: campaignTitle,
          message: campaignMessage,
          deep_link: campaignDeepLink || null,
        }),
      });
      if (res.ok) {
        showToast('Campaign draft created. Please review and confirm before broadcasting.');
        setIsNewCampaignModalOpen(false);
        setCampaignTitle('');
        setCampaignMessage('');
        setCampaignDeepLink('');
        fetchNotifications();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBroadcastConfirmation = async (campaign: NotificationCampaign) => {
    try {
      const res = await fetch('/api/campaigns/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'broadcast',
          campaign_id: campaign.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Broadcast submitted to notification provider! ID: ${data.campaign.provider_message_id}`);
        setConfirmBroadcastCampaign(null);
        fetchNotifications();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- LOCATIONS WORKFLOW ---
  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/campaigns/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: locName,
          latitude: parseFloat(locLat),
          longitude: parseFloat(locLng),
          radius_meters: Number(locRadius),
          is_active: true,
        }),
      });
      if (res.ok) {
        showToast('Campaign location saved.');
        setIsAddLocationModalOpen(false);
        setLocName('');
        fetchLocations();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- FEEDBACK REVIEW WORKFLOW ---
  const handleUpdateFeedbackStatus = async (status: 'reviewed' | 'resolved') => {
    if (!feedbackModalItem) return;
    try {
      const res = await fetch(`/api/feedback/${feedbackModalItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      });
      if (res.ok) {
        showToast(`Feedback status updated to ${status}.`);
        setFeedbackModalItem(null);
        setAdminNotes('');
        fetchFeedback();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- SETTINGS UPDATE ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('Integration settings updated successfully.');
        fetchSettings();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- FILTERED VIDEOS ---
  const filteredVideos = videos.filter((v) => {
    if (vodFilterStatus !== 'all' && v.status !== vodFilterStatus) return false;
    if (vodFilterCategory && !v.categories.includes(vodFilterCategory)) return false;
    if (
      vodSearch &&
      !v.title.toLowerCase().includes(vodSearch.toLowerCase()) &&
      !v.description.toLowerCase().includes(vodSearch.toLowerCase())
    )
      return false;
    return true;
  });

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--island-teal)', fontWeight: 600 }}>Loading Island Living CMS...</p>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #123B52 0%, #1F7A78 100%)',
          padding: '24px',
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '36px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Image
              src="/brand/ilc-logo.png"
              alt="Island Living Channel Logo"
              width={160}
              height={45}
              style={{ objectFit: 'contain', margin: '0 auto 12px' }}
              priority
            />
            <h1 style={{ fontSize: '24px', color: 'var(--deep-ocean)', marginBottom: '6px' }}>Editorial CMS</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-text)' }}>
              Sign in to manage videos, welcome gifts, campaigns, and community operations.
            </p>
          </div>

          {loginError && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Work Email</label>
              <input
                type="email"
                className="input-field"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
              Enter Editorial Console
            </button>
          </form>

          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
              fontSize: '12px',
              color: 'var(--muted-text)',
            }}
          >
            <p>Demo Staff Account pre-filled:</p>
            <code>admin@islandlivingchannel.tv / admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN AUTHENTICATED CMS DASHBOARD ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-alt)' }}>
      {/* SIDEBAR NAVIGATION */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 10,
        }}
      >
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <Image
            src="/brand/ilc-logo.png"
            alt="Island Living Channel"
            width={140}
            height={40}
            style={{ objectFit: 'contain' }}
            priority
          />
          <div
            style={{
              display: 'inline-block',
              marginTop: '8px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--island-teal)',
              backgroundColor: '#e6f4f3',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.05em',
            }}
          >
            Editorial CMS
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'dashboard', label: 'Overview', icon: '📊' },
            { id: 'vod', label: 'VOD Library', icon: '🎬' },
            { id: 'gifts', label: 'Welcome Gifts', icon: '🎁' },
            { id: 'notifications', label: 'Announcements', icon: '📣' },
            { id: 'locations', label: 'Hub Geofences', icon: '📍' },
            { id: 'feedback', label: 'Merchant Feedback', icon: '⭐' },
            { id: 'members', label: 'Member Directory', icon: '👥' },
            { id: 'settings', label: 'Integration & Audit', icon: '⚙️' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--island-teal)' : 'var(--ink)',
                  backgroundColor: isActive ? '#f0f9f8' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* CURRENT USER & SIGNOUT */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)', backgroundColor: '#fafbfc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--island-teal)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              {user.display_name.charAt(0)}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {user.display_name}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--muted-text)', textTransform: 'capitalize' }}>{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', fontSize: '12px', justifyContent: 'center' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {/* TOAST ALERT */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              backgroundColor: 'var(--deep-ocean)',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 2000,
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Overview Dashboard</h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Live operational snapshot connected to mobile application.
                </p>
              </div>
              <button
                className="btn btn-coral"
                onClick={() => {
                  setActiveTab('vod');
                  setIsUploadModalOpen(true);
                }}
              >
                + Upload Video to Mobile
              </button>
            </div>

            {/* KPI STATS CARDS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              {[
                { label: 'Published Videos', val: videos.filter((v) => v.status === 'published').length, color: 'var(--island-teal)' },
                { label: 'Drafts in Review', val: videos.filter((v) => v.status === 'draft').length, color: 'var(--coral-accent)' },
                { label: 'Active Welcome Gifts', val: welcomeGifts.filter((g) => g.is_active).length, color: 'var(--deep-ocean)' },
                { label: 'Transit Geofences', val: locations.filter((l) => l.is_active).length, color: '#059669' },
                { label: 'Pending Feedback', val: feedbackList.filter((f) => f.status === 'new').length, color: '#d97706' },
              ].map((kpi, i) => (
                <div key={i} className="card" style={{ padding: '20px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted-text)', textTransform: 'uppercase' }}>
                    {kpi.label}
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: 800, color: kpi.color, marginTop: '8px' }}>{kpi.val}</p>
                </div>
              ))}
            </div>

            {/* RECENT VIDEOS & RECENT FEEDBACK */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)' }}>Recent Videos</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('vod')}>
                    View All ({videos.length})
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {videos.slice(0, 4).map((v) => (
                    <div
                      key={v.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '32px',
                            position: 'relative',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            backgroundColor: '#e2e8f0',
                          }}
                        >
                          <Image src={v.thumbnail_path} alt={v.title} fill style={{ objectFit: 'cover' }} unoptimized />
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600 }}>{v.title}</p>
                          <p style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                            {v.categories.join(', ')} • {v.duration_seconds ? `${Math.floor(v.duration_seconds / 60)}m` : 'VOD'}
                          </p>
                        </div>
                      </div>
                      <span className={`badge badge-${v.status}`}>{v.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)' }}>Recent Merchant Feedback</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('feedback')}>
                    Review All
                  </button>
                </div>
                {feedbackList.length === 0 ? (
                  <p style={{ color: 'var(--muted-text)', fontSize: '13px' }}>No feedback submitted yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {feedbackList.slice(0, 4).map((f) => (
                      <div
                        key={f.id}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>{f.merchant_name}</span>
                          <span style={{ color: '#f59e0b', fontSize: '13px' }}>{'★'.repeat(f.rating)}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--ink)' }}>&ldquo;{f.comment}&rdquo;</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px' }}>
                          <span style={{ color: 'var(--muted-text)' }}>by {f.user_display_name || 'Member'}</span>
                          <span className={`badge badge-${f.status}`}>{f.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VOD MANAGEMENT */}
        {activeTab === 'vod' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Video On Demand (VOD)</h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Upload, curate, and publish lifestyle videos to the mobile application.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)}>
                + Upload New Video
              </button>
            </div>

            {/* FILTERS & SEARCH BAR */}
            <div
              className="card"
              style={{
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: '220px' }}>
                <input
                  type="text"
                  placeholder="Search by title, tag, or description..."
                  className="input-field"
                  value={vodSearch}
                  onChange={(e) => setVodSearch(e.target.value)}
                />
              </div>

              <div>
                <select
                  className="input-field"
                  value={vodFilterStatus}
                  onChange={(e) => setVodFilterStatus(e.target.value)}
                  style={{ minWidth: '150px' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>

              <div>
                <select
                  className="input-field"
                  value={vodFilterCategory}
                  onChange={(e) => setVodFilterCategory(e.target.value)}
                  style={{ minWidth: '180px' }}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* VIDEOS DATA TABLE */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Preview</th>
                    <th>Title & Description</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Published At</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVideos.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted-text)' }}>
                        No videos matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredVideos.map((video) => (
                      <tr key={video.id}>
                        <td>
                          <div
                            onClick={() => setPreviewVideo(video)}
                            style={{
                              width: '72px',
                              height: '48px',
                              position: 'relative',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              backgroundColor: '#e2e8f0',
                              cursor: 'pointer',
                            }}
                          >
                            <Image
                              src={video.thumbnail_path}
                              alt={video.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              unoptimized
                            />
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '14px',
                              }}
                            >
                              ▶
                            </div>
                          </div>
                        </td>
                        <td>
                          <p style={{ fontWeight: 600, color: 'var(--deep-ocean)', marginBottom: '2px' }}>{video.title}</p>
                          <p
                            style={{
                              fontSize: '12px',
                              color: 'var(--muted-text)',
                              maxWidth: '350px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {video.description}
                          </p>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{video.categories.join(', ')}</span>
                        </td>
                        <td>{video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)} min` : 'VOD'}</td>
                        <td>
                          <span className={`badge badge-${video.status}`}>{video.status}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                            {video.published_at ? new Date(video.published_at).toLocaleDateString() : 'Unpublished'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleTogglePublish(video)}
                              title="Toggle mobile publish visibility"
                            >
                              {video.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setPreviewVideo(video)}
                              title="Play Video"
                            >
                              Play
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: WELCOME GIFTS */}
        {activeTab === 'gifts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Welcome Gifts & Perks</h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Manage digital membership privileges and track issued vouchers.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className={`btn ${giftViewMode === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setGiftViewMode('catalog')}
                >
                  Gift Campaigns
                </button>
                <button
                  className={`btn ${giftViewMode === 'issued' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setGiftViewMode('issued')}
                >
                  Issued Member Vouchers ({memberGifts.length})
                </button>
                <button className="btn btn-coral" onClick={() => setIsAddGiftModalOpen(true)}>
                  + New Welcome Gift
                </button>
              </div>
            </div>

            {giftViewMode === 'catalog' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '20px',
                }}
              >
                {welcomeGifts.map((gift) => (
                  <div key={gift.id} className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ height: '140px', position: 'relative', backgroundColor: '#e2e8f0' }}>
                      <Image src={gift.image_path} alt={gift.title} fill style={{ objectFit: 'cover' }} unoptimized />
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <span className={`badge ${gift.is_active ? 'badge-active' : 'badge-archived'}`}>
                          {gift.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '16px', color: 'var(--deep-ocean)', marginBottom: '6px' }}>{gift.title}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginBottom: '14px', minHeight: '40px' }}>
                        {gift.description}
                      </p>
                      <div
                        style={{
                          fontSize: '12px',
                          padding: '10px',
                          backgroundColor: 'var(--surface-alt)',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '14px',
                        }}
                      >
                        <p>
                          <strong>Validity:</strong> {gift.validity_days} days from issue
                        </p>
                        <p>
                          <strong>Eligibility:</strong> {gift.new_member_only ? 'New Members' : 'All Members'}
                        </p>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                        <strong>Instructions:</strong> {gift.redemption_instructions}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Voucher Code</th>
                      <th>Recipient</th>
                      <th>Gift Title</th>
                      <th>Issued At</th>
                      <th>Expires At</th>
                      <th>Status</th>
                      <th>Redeemed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberGifts.map((mg) => (
                      <tr key={mg.id}>
                        <td>
                          <code style={{ fontWeight: 700, color: 'var(--island-teal)' }}>{mg.redemption_code}</code>
                        </td>
                        <td>{mg.user_display_name || 'Member'}</td>
                        <td>{mg.gift?.title || 'Welcome Gift'}</td>
                        <td>{new Date(mg.issued_at).toLocaleDateString()}</td>
                        <td>{new Date(mg.expires_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge badge-${mg.status}`}>{mg.status}</span>
                        </td>
                        <td>
                          {mg.redeemed_at ? new Date(mg.redeemed_at).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS & BROADCASTS */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                  Island Announcements & Notifications
                </h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Broadcast travel alerts and live program updates to mobile devices.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setIsNewCampaignModalOpen(true)}>
                + Draft Announcement
              </button>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title & Message</th>
                    <th>Deep Link</th>
                    <th>Audience</th>
                    <th>Status</th>
                    <th>Provider Message ID</th>
                    <th>Created</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <p style={{ fontWeight: 600, color: 'var(--deep-ocean)' }}>{n.title}</p>
                        <p style={{ fontSize: '13px', color: 'var(--muted-text)' }}>{n.message}</p>
                      </td>
                      <td>
                        <code>{n.deep_link || 'None'}</code>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{n.target_audience || 'All'}</td>
                      <td>
                        <span className={`badge badge-${n.status}`}>{n.status}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                          {n.provider_message_id || 'Not broadcasted'}
                        </span>
                      </td>
                      <td>{new Date(n.created_at).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        {n.status === 'draft' ? (
                          <button
                            className="btn btn-coral btn-sm"
                            onClick={() => setConfirmBroadcastCampaign(n)}
                          >
                            Broadcast...
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>Sent</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CAMPAIGN LOCATIONS (GEOFENCES) */}
        {activeTab === 'locations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                  Transit Hubs & Campaign Geofences
                </h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Configure island coordinate perimeters for proximity-triggered messages and partner welcome hubs.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setIsAddLocationModalOpen(true)}>
                + Add Island Location
              </button>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Location / Transit Hub Name</th>
                    <th>Description</th>
                    <th>Coordinates (Lat, Lng)</th>
                    <th>Radius</th>
                    <th>Status</th>
                    <th>Associated Campaign</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((loc) => (
                    <tr key={loc.id}>
                      <td>
                        <p style={{ fontWeight: 600, color: 'var(--deep-ocean)' }}>{loc.name}</p>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'var(--muted-text)' }}>{loc.description || '—'}</span>
                      </td>
                      <td>
                        <code>
                          {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                        </code>
                      </td>
                      <td>{loc.radius_meters} meters</td>
                      <td>
                        <span className={`badge ${loc.is_active ? 'badge-active' : 'badge-archived'}`}>
                          {loc.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                          {loc.associated_campaign_id || 'General Welcome Hub'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: MERCHANT FEEDBACK */}
        {activeTab === 'feedback' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                  Member Merchant Feedback
                </h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Review member ratings and verified comments for island partners.
                </p>
              </div>
              <div>
                <select
                  className="input-field"
                  value={feedbackFilterStatus}
                  onChange={(e) => setFeedbackFilterStatus(e.target.value)}
                  style={{ minWidth: '160px' }}
                >
                  <option value="all">All Feedback</option>
                  <option value="new">New / Unreviewed</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Merchant / Island Partner</th>
                    <th>Rating</th>
                    <th>Customer Comment</th>
                    <th>Member Name</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th style={{ textAlign: 'right' }}>Review Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList
                    .filter((f) => feedbackFilterStatus === 'all' || f.status === feedbackFilterStatus)
                    .map((item) => (
                      <tr key={item.id}>
                        <td>
                          <p style={{ fontWeight: 600 }}>{item.merchant_name}</p>
                        </td>
                        <td>
                          <span style={{ color: '#f59e0b', fontSize: '14px' }}>{'★'.repeat(item.rating)}</span>
                        </td>
                        <td>
                          <p style={{ fontSize: '13px', maxWidth: '320px' }}>&ldquo;{item.comment}&rdquo;</p>
                          {item.admin_notes && (
                            <p style={{ fontSize: '11px', color: 'var(--island-teal)', marginTop: '4px' }}>
                              <strong>Note:</strong> {item.admin_notes}
                            </p>
                          )}
                        </td>
                        <td>{item.user_display_name || 'Member'}</td>
                        <td>
                          <span className={`badge badge-${item.status}`}>{item.status}</span>
                        </td>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setFeedbackModalItem(item);
                              setAdminNotes(item.admin_notes || '');
                            }}
                          >
                            Review...
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: MEMBER DIRECTORY (PRIVACY-PRESERVING) */}
        {activeTab === 'members' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                  Member Community Directory
                </h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Privacy-preserving directory. Displays opaque public membership codes; personal email and credentials
                  are strictly omitted.
                </p>
              </div>
              <div style={{ minWidth: '280px' }}>
                <input
                  type="text"
                  placeholder="Search by name or ILC code..."
                  className="input-field"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Display Name</th>
                    <th>Public Membership Identifier</th>
                    <th>Account Status</th>
                    <th>Member Since</th>
                  </tr>
                </thead>
                <tbody>
                  {members
                    .filter(
                      (m) =>
                        !memberSearch ||
                        m.display_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                        m.membership_code.toLowerCase().includes(memberSearch.toLowerCase())
                    )
                    .map((m) => (
                      <tr key={m.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#e2e8f0',
                                color: 'var(--deep-ocean)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}
                            >
                              {m.display_name.charAt(0)}
                            </div>
                            <span style={{ fontWeight: 600 }}>{m.display_name}</span>
                          </div>
                        </td>
                        <td>
                          <code style={{ fontSize: '14px', fontWeight: 700, color: 'var(--island-teal)' }}>
                            {m.membership_code}
                          </code>
                        </td>
                        <td>
                          <span className="badge badge-active">{m.status}</span>
                        </td>
                        <td>{new Date(m.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS & AUDIT TRAIL */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                Platform Settings & Audit Trail
              </h1>
              <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                Configure partner integrations (YouTube, Otamigo) and review administrative actions.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* SETTINGS CARD */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)', marginBottom: '16px' }}>
                  Integration Configuration
                </h3>
                <form onSubmit={handleSaveSettings}>
                  <div className="form-group">
                    <label className="form-label">YouTube Live Stream ID</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.youtube_live_stream_id || ''}
                      onChange={(e) => setSettings({ ...settings, youtube_live_stream_id: e.target.value })}
                    />
                    <small style={{ color: 'var(--muted-text)', fontSize: '12px' }}>
                      Configures the stream player for Live TV tab on mobile.
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">YouTube Fallback Channel URL</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.youtube_channel_url || ''}
                      onChange={(e) => setSettings({ ...settings, youtube_channel_url: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Otamigo Travel Booking Base URL</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.otamigo_booking_base_url || ''}
                      onChange={(e) => setSettings({ ...settings, otamigo_booking_base_url: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Otamigo Affiliate Identifier</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.otamigo_affiliate_id || ''}
                      onChange={(e) => setSettings({ ...settings, otamigo_affiliate_id: e.target.value })}
                    />
                    <small style={{ color: 'var(--muted-text)', fontSize: '12px' }}>
                      Appended as ?aff= identifier for transparent partner attribution.
                    </small>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                    Save Configuration
                  </button>
                </form>
              </div>

              {/* AUDIT LOG CARD */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)', marginBottom: '16px' }}>
                  Administrative Audit Trail
                </h3>
                <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {auditEvents.map((evt) => (
                    <div
                      key={evt.id}
                      style={{
                        padding: '10px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <strong style={{ color: 'var(--island-teal)' }}>{evt.action}</strong>
                        <span style={{ color: 'var(--muted-text)' }}>
                          {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ color: 'var(--muted-text)' }}>
                        by <code>{evt.actor_email}</code> on {evt.entity_type} ({evt.entity_id})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL 1: VIDEO UPLOAD WORKFLOW --- */}
        {isUploadModalOpen && (
          <div className="modal-overlay" onClick={() => !isUploading && setIsUploadModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Upload Video Feature</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginBottom: '20px' }}>
                Directly upload MP4 videos and publish to the Island Living mobile app.
              </p>

              {uploadError && (
                <div
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    marginBottom: '16px',
                  }}
                >
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleVideoUploadSubmit}>
                <div className="form-group">
                  <label className="form-label">Video MP4 File (Dropzone)</label>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="input-field"
                    onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  />
                  <small style={{ color: 'var(--muted-text)', fontSize: '11px' }}>
                    Supported formats: MP4, WebM (up to 150MB). If omitted, demo media is attached.
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Video Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coron Island: Kayangan Lake & Coral Gardens"
                    className="input-field"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    rows={3}
                    placeholder="Provide editorial overview..."
                    className="input-field"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="input-field"
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Publication Status</label>
                    <select
                      className="input-field"
                      value={uploadStatus}
                      onChange={(e) => setUploadStatus(e.target.value as any)}
                    >
                      <option value="published">Publish Immediately to Mobile</option>
                      <option value="draft">Save as Draft</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Palawan, Diving, Marine Reserve"
                    className="input-field"
                    value={uploadTags}
                    onChange={(e) => setUploadTags(e.target.value)}
                  />
                </div>

                {isUploading && (
                  <div style={{ margin: '16px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span>Uploading & Processing Media...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${uploadProgress}%`,
                          backgroundColor: 'var(--island-teal)',
                          transition: 'width 0.2s',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsUploadModalOpen(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Save & Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 2: VIDEO PREVIEW PLAYER --- */}
        {previewVideo && (
          <div className="modal-overlay" onClick={() => setPreviewVideo(null)}>
            <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)' }}>{previewVideo.title}</h3>
                <button
                  onClick={() => setPreviewVideo(null)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ backgroundColor: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
                <video
                  src={previewVideo.media_path}
                  controls
                  autoPlay
                  style={{ width: '100%', maxHeight: '420px', display: 'block' }}
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--ink)', marginBottom: '8px' }}>{previewVideo.description}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className={`badge badge-${previewVideo.status}`}>{previewVideo.status}</span>
                {previewVideo.categories.map((c, i) => (
                  <span key={i} className="badge" style={{ backgroundColor: '#e2e8f0' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL 3: WELCOME GIFT CREATION --- */}
        {isAddGiftModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddGiftModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Add Welcome Gift Campaign</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginBottom: '20px' }}>
                Privileges issued to eligible members upon registration.
              </p>

              <form onSubmit={handleCreateGift}>
                <div className="form-group">
                  <label className="form-label">Gift Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Free Sunset Cocktail at Partner Lounge"
                    className="input-field"
                    value={giftTitle}
                    onChange={(e) => setGiftTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Explain the perk to the member..."
                    className="input-field"
                    value={giftDescription}
                    onChange={(e) => setGiftDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Validity (Days from Issue)</label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    className="input-field"
                    value={giftValidityDays}
                    onChange={(e) => setGiftValidityDays(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Redemption Instructions *</label>
                  <input
                    type="text"
                    required
                    placeholder="Show QR pass to partner receptionist..."
                    className="input-field"
                    value={giftInstructions}
                    onChange={(e) => setGiftInstructions(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsAddGiftModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 4: NOTIFICATION BROADCAST CONFIRMATION --- */}
        {confirmBroadcastCampaign && (
          <div className="modal-overlay" onClick={() => setConfirmBroadcastCampaign(null)}>
            <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '18px', color: 'var(--deep-ocean)', marginBottom: '8px' }}>
                Confirm Notification Broadcast
              </h2>
              <div
                style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  fontSize: '13px',
                }}
              >
                ⚠️ <strong>Live Delivery Action:</strong> This announcement will be submitted to mobile devices.
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontWeight: 700, fontSize: '14px' }}>{confirmBroadcastCampaign.title}</p>
                <p style={{ fontSize: '13px', color: 'var(--ink)', marginTop: '4px' }}>
                  {confirmBroadcastCampaign.message}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => setConfirmBroadcastCampaign(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-coral"
                  onClick={() => handleBroadcastConfirmation(confirmBroadcastCampaign)}
                >
                  Confirm & Broadcast
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL 5: NEW ANNOUNCEMENT FORM --- */}
        {isNewCampaignModalOpen && (
          <div className="modal-overlay" onClick={() => setIsNewCampaignModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Draft Announcement</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginBottom: '20px' }}>
                Compose push notification message for travel updates and event alerts.
              </p>

              <form onSubmit={handleCreateCampaign}>
                <div className="form-group">
                  <label className="form-label">Notification Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boracay Sunset Music Series Tonight"
                    className="input-field"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notification Body *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Join us live at Station 2 for sunset acoustics starting at 5 PM."
                    className="input-field"
                    value={campaignMessage}
                    onChange={(e) => setCampaignMessage(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Deep Link (Optional)</label>
                  <input
                    type="text"
                    placeholder="ilc://vod/siargao-sunrise-cloud-9-and-beyond"
                    className="input-field"
                    value={campaignDeepLink}
                    onChange={(e) => setCampaignDeepLink(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsNewCampaignModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Draft
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 6: ADD LOCATION GEOFENCE --- */}
        {isAddLocationModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddLocationModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Add Island Transit Hub</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginBottom: '20px' }}>
                Set up location radius for mobile geofence monitoring.
              </p>

              <form onSubmit={handleCreateLocation}>
                <div className="form-group">
                  <label className="form-label">Location / Hub Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Panglao International Airport Hub"
                    className="input-field"
                    value={locName}
                    onChange={(e) => setLocName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Latitude *</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      className="input-field"
                      value={locLat}
                      onChange={(e) => setLocLat(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Longitude *</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      className="input-field"
                      value={locLng}
                      onChange={(e) => setLocLng(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Radius (Meters) *</label>
                  <input
                    type="number"
                    min={50}
                    max={10000}
                    required
                    className="input-field"
                    value={locRadius}
                    onChange={(e) => setLocRadius(Number(e.target.value))}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsAddLocationModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Location
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 7: FEEDBACK REVIEW --- */}
        {feedbackModalItem && (
          <div className="modal-overlay" onClick={() => setFeedbackModalItem(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                Review Member Feedback
              </h2>
              <div style={{ margin: '16px 0', padding: '16px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontWeight: 600 }}>{feedbackModalItem.merchant_name}</p>
                <p style={{ color: '#f59e0b', fontSize: '15px', margin: '4px 0' }}>
                  {'★'.repeat(feedbackModalItem.rating)} ({feedbackModalItem.rating}/5)
                </p>
                <p style={{ fontSize: '14px', color: 'var(--ink)' }}>&ldquo;{feedbackModalItem.comment}&rdquo;</p>
              </div>

              <div className="form-group">
                <label className="form-label">Admin Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record verification with merchant partner..."
                  className="input-field"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setFeedbackModalItem(null)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleUpdateFeedbackStatus('reviewed')}
                >
                  Mark Reviewed
                </button>
                <button
                  type="button"
                  className="btn btn-coral"
                  onClick={() => handleUpdateFeedbackStatus('resolved')}
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
