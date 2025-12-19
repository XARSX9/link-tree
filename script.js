let hasUserInteracted = false;

function initMedia() {
  console.log("initMedia called");
  const backgroundMusic = document.getElementById('background-music');
  const backgroundVideo = document.getElementById('background');
  if (!backgroundMusic || !backgroundVideo) {
    console.error("Media elements not found");
    return;
  }
  backgroundMusic.volume = 0.3;
  backgroundVideo.muted = true; 

  
  backgroundVideo.play().catch(err => {
    console.error("Failed to play background video:", err);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const visitorCount = document.getElementById('visitor-count');
  const backgroundMusic = document.getElementById('background-music');
  const hackerMusic = document.getElementById('hacker-music');
  const rainMusic = document.getElementById('rain-music');
  const animeMusic = document.getElementById('anime-music');
  const carMusic = document.getElementById('car-music');
  const homeButton = document.getElementById('home-theme');
  const hackerButton = document.getElementById('hacker-theme');
  const rainButton = document.getElementById('rain-theme');
  const animeButton = document.getElementById('anime-theme');
  const carButton = document.getElementById('car-theme');
  const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsButton = document.getElementById('results-theme');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  const backgroundVideo = document.getElementById('background');
  const hackerOverlay = document.getElementById('hacker-overlay');
  const snowOverlay = document.getElementById('snow-overlay');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');
  const resultsHint = document.getElementById('results-hint');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');
  const discordActivityBlock = document.getElementById('discord-activity-block');
  const discordActivityAvatar = document.getElementById('discord-activity-avatar');
  const discordActivityNameLine = document.getElementById('discord-activity-name-line');
  const discordActivityStatusLine = document.getElementById('discord-activity-status-line');
  
  // New Discord status section elements
  const discordStatusBlock = document.getElementById('discord-status-block');
  const discordStatusAvatar = document.getElementById('discord-status-avatar');
  const discordStatusName = document.getElementById('discord-status-name');
  const discordStatusText = document.getElementById('discord-status-text');
  const discordStatusIndicator = document.getElementById('discord-status-indicator');
  const discordStatusBadges = document.getElementById('discord-status-badges');

  
  const cursor = document.querySelector('.custom-cursor');
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // Always show Discord activity mini-card with a default message
  if (discordActivityBlock && discordActivityStatusLine) {
    discordActivityBlock.style.display = 'block';
    if (!discordActivityStatusLine.textContent) {
      discordActivityStatusLine.textContent = 'Discord status not connected yet.';
    }
  }

  // Fetch live Discord data (via Lanyard) and update name + avatar
  // Replace this with YOUR Discord user ID
  const DISCORD_USER_ID = '1407792466958221383';

  // Function to format time difference for "last seen"
  function formatLastSeen(timestamp) {
    if (!timestamp) return 'Unknown';
    
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  }

  function updateDiscordStatus() {
    if (!DISCORD_USER_ID || DISCORD_USER_ID === 'YOUR_DISCORD_USER_ID_HERE') return;
    
    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.success || !data.data || !data.data.discord_user) return;

        const discordData = data.data;
        const user = discordData.discord_user;
        const displayName = user.global_name || user.username;

        // Update visible name immediately
        profileName.textContent = displayName;
        // Also update name used by typewriter effect
        name = displayName;

        // Build avatar URL (fallback if no avatar) and sync mini-card avatar
        if (user.avatar) {
          const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
          profilePicture.src = avatarUrl;
          if (discordActivityAvatar) {
            discordActivityAvatar.src = avatarUrl;
          }
          if (discordStatusAvatar) {
            discordStatusAvatar.src = avatarUrl;
          }
        }

        // Build live presence/status line for the bio
        const statusMap = {
          online: 'Online',
          idle: 'Idle',
          dnd: 'Do Not Disturb',
          offline: 'Offline'
        };

        const statusRaw = discordData.discord_status;
        const statusText = statusMap[statusRaw] || 'Unknown';

        // Track last online timestamp
        const lastOnlineKey = `discord_last_online_${DISCORD_USER_ID}`;
        if (statusRaw !== 'offline') {
          // User is online/idle/dnd - update last online timestamp
          localStorage.setItem(lastOnlineKey, Date.now().toString());
        }

        const activities = discordData.activities || [];
        const customStatus = activities.find(a => a.type === 4 && a.state);
        const gameActivity = activities.find(a => a.type === 0 && a.name);

        let activityText = '';
        if (customStatus) {
          activityText = ` — ${customStatus.state}`;
        } else if (gameActivity) {
          activityText = ` — Playing ${gameActivity.name}`;
        }

        const presenceText = `Status: ${statusText}${activityText}`;

        // If typewriter bio is used, replace the first message with live presence
        if (Array.isArray(bioMessages) && presenceText.trim().length > 0) {
          bioMessages[0] = presenceText;
        } else {
          // Fallback: set bio text directly
          profileBio.textContent = presenceText;
        }

        // Fill dedicated Discord activity mini-card below the main profile
        if (discordActivityBlock && discordActivityNameLine && discordActivityStatusLine) {
          discordActivityBlock.style.display = 'flex';
          discordActivityNameLine.textContent = displayName;
          discordActivityStatusLine.textContent = presenceText;
        }

        // Update new Discord status section
        if (discordStatusBlock) {
          // Update name - show itzarya_x with discriminator/server tag
          if (discordStatusName) {
            let userIdDisplay = 'itzarya_x';
            // Add discriminator if available (format: username#discriminator)
            if (user.discriminator && user.discriminator !== '0') {
              userIdDisplay = `itzarya_x#${user.discriminator}`;
            }
            discordStatusName.textContent = userIdDisplay;
          }

          // Update status text - show detailed activity/status
          if (discordStatusText) {
            let statusDisplayText = '';
            
            // Check for streaming activity
            const streamingActivity = activities.find(a => a.type === 1);
            if (streamingActivity) {
              statusDisplayText = `🔴 Streaming ${streamingActivity.name}`;
              if (streamingActivity.details) {
                statusDisplayText += ` - ${streamingActivity.details}`;
              }
            }
            // Check for playing game
            else if (gameActivity) {
              statusDisplayText = `🎮 Playing ${gameActivity.name}`;
              if (gameActivity.details) {
                statusDisplayText += ` - ${gameActivity.details}`;
              }
            }
            // Check for listening activity
            else if (activities.find(a => a.type === 2)) {
              const listeningActivity = activities.find(a => a.type === 2);
              statusDisplayText = `🎵 Listening to ${listeningActivity.name}`;
              if (listeningActivity.details) {
                statusDisplayText += ` - ${listeningActivity.details}`;
              }
            }
            // Check for watching activity
            else if (activities.find(a => a.type === 3)) {
              const watchingActivity = activities.find(a => a.type === 3);
              statusDisplayText = `👀 Watching ${watchingActivity.name}`;
            }
            // Check for custom status
            else if (customStatus && customStatus.state) {
              statusDisplayText = customStatus.state;
            }
            // If offline, show last seen
            else if (statusRaw === 'offline') {
              const lastOnlineTimestamp = localStorage.getItem(lastOnlineKey);
              if (lastOnlineTimestamp) {
                const lastSeenTime = parseInt(lastOnlineTimestamp);
                const lastSeenText = formatLastSeen(lastSeenTime);
                statusDisplayText = `Last seen: ${lastSeenText}`;
              } else {
                statusDisplayText = 'Offline';
              }
            }
            // Fallback to status
            else {
              statusDisplayText = statusText;
            }
            
            discordStatusText.textContent = statusDisplayText;
          }

          // Update status indicator
          if (discordStatusIndicator) {
            discordStatusIndicator.className = 'status-indicator';
            discordStatusIndicator.classList.add(statusRaw || 'offline');
          }

          // Update badges
          if (discordStatusBadges) {
            discordStatusBadges.innerHTML = '';
            
            // Get user flags/badges from Discord API
            const flags = user.public_flags || 0;
            const badges = [];
            
            // Discord badge flags mapping with real Discord badge emojis
            if (flags & 1) badges.push({ name: 'Staff', icon: '🛡️' });
            if (flags & 2) badges.push({ name: 'Partner', icon: '🤝' });
            if (flags & 4) badges.push({ name: 'Hypesquad', icon: '⚡' });
            if (flags & 8) badges.push({ name: 'Bug Hunter Level 1', icon: '🐛' });
            if (flags & 64) badges.push({ name: 'Hypesquad Bravery', icon: '⚔️' });
            if (flags & 128) badges.push({ name: 'Hypesquad Brilliance', icon: '💎' });
            if (flags & 256) badges.push({ name: 'Hypesquad Balance', icon: '⚖️' });
            if (flags & 512) badges.push({ name: 'Early Supporter', icon: '⭐' });
            if (flags & 16384) badges.push({ name: 'Bug Hunter Level 2', icon: '🐛' });
            if (flags & 65536) badges.push({ name: 'Verified Bot Developer', icon: '✅' });
            if (flags & 131072) badges.push({ name: 'Active Developer', icon: '💻' });
            if (flags & 4194304) badges.push({ name: 'Verified Bot', icon: '🤖' });
            
            // Add premium badges if available
            if (discordData.premium_type === 1) {
              badges.push({ name: 'Nitro Classic', icon: '💎' });
            } else if (discordData.premium_type === 2) {
              badges.push({ name: 'Nitro', icon: '💎' });
            }
            
            // Always show at least one badge for testing, or show all found badges
            if (badges.length > 0) {
              badges.forEach(badge => {
                const badgeElement = document.createElement('div');
                badgeElement.className = 'discord-badge-item';
                badgeElement.title = badge.name;
                badgeElement.textContent = badge.icon;
                badgeElement.style.cssText = `
                  font-size: 16px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: rgba(255, 255, 255, 0.15);
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  opacity: 1;
                  visibility: visible;
                `;
                discordStatusBadges.appendChild(badgeElement);
              });
            } else {
              // Show a placeholder if no badges found
              const placeholderBadge = document.createElement('div');
              placeholderBadge.className = 'discord-badge-item';
              placeholderBadge.textContent = '✓';
              placeholderBadge.style.cssText = `
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(88, 101, 242, 0.3);
                border: 1px solid rgba(88, 101, 242, 0.5);
                width: 24px;
                height: 24px;
                border-radius: 50%;
                opacity: 1;
                visibility: visible;
                color: #fff;
              `;
              discordStatusBadges.appendChild(placeholderBadge);
            }
          }
        }
      })
      .catch(err => {
        console.error('Failed to fetch Discord data from Lanyard:', err);
        if (discordStatusBlock) {
          if (discordStatusName) {
            discordStatusName.textContent = 'itzarya_x';
          }
          if (discordStatusText) {
            discordStatusText.textContent = 'Offline';
          }
          if (discordStatusIndicator) {
            discordStatusIndicator.className = 'status-indicator offline';
          }
        }
      });
  }

  // Initial fetch and set up real-time updates
  if (DISCORD_USER_ID && DISCORD_USER_ID !== 'YOUR_DISCORD_USER_ID_HERE') {
    updateDiscordStatus();
    // Update every 10 seconds
    setInterval(updateDiscordStatus, 10000);
  }

  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    });

    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    });

    document.addEventListener('touchend', () => {
      cursor.style.display = 'none'; 
    });
  } else {

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.display = 'block';
    });

    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.8) translate(-50%, -50%)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'scale(1) translate(-50%, -50%)';
    });
  }


  const startMessage = "Click here to see the motion baby";
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
    }
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    setTimeout(typeWriterStart, 100);
  }


  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
  }, 500);


  function initializeVisitorCounter() {
    // Reset old counter values (from previous version)
    let totalVisitors = localStorage.getItem('totalVisitorCount');
    if (totalVisitors && parseInt(totalVisitors) > 1000) {
      // Clear old high values
      localStorage.removeItem('totalVisitorCount');
      localStorage.removeItem('hasVisited');
      totalVisitors = null;
    }
    
    if (!totalVisitors) {
      totalVisitors = 0;
      localStorage.setItem('totalVisitorCount', totalVisitors);
    } else {
      totalVisitors = parseInt(totalVisitors);
    }

    const hasVisited = localStorage.getItem('hasVisited');
    const previousCount = totalVisitors;
    
    if (!hasVisited) {
      totalVisitors++;
      localStorage.setItem('totalVisitorCount', totalVisitors);
      localStorage.setItem('hasVisited', 'true');
      // Animate from previous count to new count on first visit
      animateCounter(visitorCount, previousCount, totalVisitors, 1000);
    } else {
      // Just display the current count without animation
      visitorCount.textContent = totalVisitors.toLocaleString();
    }
  }

  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const startValue = start;
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart);
      
      element.textContent = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = end.toLocaleString();
      }
    }
    
    requestAnimationFrame(updateCounter);
  }

  initializeVisitorCounter();


  startScreen.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(err => {
      console.error("Failed to play music after start screen click:", err);
    });
    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
        profileBlock.classList.add('profile-appear');
        profileContainer.classList.add('orbit');
      }}
    );
    if (!isTouchDevice) {
      try {
        new cursorTrailEffect({
          length: 10,
          size: 8,
          speed: 0.2
        });
        console.log("Cursor trail initialized");
      } catch (err) {
        console.error("Failed to initialize cursor trail effect:", err);
      }
    }
    typeWriterName();
    typeWriterBio();
  });

  startScreen.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startScreen.classList.add('hidden');
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(err => {
      console.error("Failed to play music after start screen touch:", err);
    });
    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
        profileBlock.classList.add('profile-appear');
        profileContainer.classList.add('orbit');
      }}
    );
    if (!isTouchDevice) {
      try {
        new cursorTrailEffect({
          length: 10,
          size: 8,
          speed: 0.2
        });
        console.log("Cursor trail initialized");
      } catch (err) {
        console.error("Failed to initialize cursor trail effect:", err);
      }
    }
    typeWriterName();
    typeWriterBio();
  });


  let name = "JAQLIV";
  let nameText = '';
  let nameIndex = 0;
  let isNameDeleting = false;
  let nameCursorVisible = true;

  function typeWriterName() {
    if (!isNameDeleting && nameIndex < name.length) {
      nameText = name.slice(0, nameIndex + 1);
      nameIndex++; 
    } else if (isNameDeleting && nameIndex > 0) {
      nameText = name.slice(0, nameIndex - 1);
      nameIndex--;
    } else if (nameIndex === name.length) {
      isNameDeleting = true;
      setTimeout(typeWriterName, 10000);
      return;
    } else if (nameIndex === 0) {
      isNameDeleting = false;
    }
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileName.classList.add('glitch');
      setTimeout(() => profileName.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterName, isNameDeleting ? 150 : 300);
  }

  setInterval(() => {
    nameCursorVisible = !nameCursorVisible;
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
  }, 500);


  let bioMessages = [
    "loading....",
    "\"Powered by coffee & late nights ☕\""
  ];
  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = 0;
  let isBioDeleting = false;
  let bioCursorVisible = true;

  function typeWriterBio() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(typeWriterBio, 2000);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = (bioMessageIndex + 1) % bioMessages.length;
    }
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileBio.classList.add('glitch');
      setTimeout(() => profileBio.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterBio, isBioDeleting ? 75 : 150);
  }

  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
  }, 500);


  let currentAudio = backgroundMusic;
  let isMuted = false;

  volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeIcon.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMuted = !isMuted;
    currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeSlider.addEventListener('input', () => {
    currentAudio.volume = volumeSlider.value;
    isMuted = false;
    currentAudio.muted = false;
    volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });


  transparencySlider.addEventListener('input', () => {
    const opacity = transparencySlider.value;
    if (opacity == 0) {
      profileBlock.style.background = 'rgba(0, 0, 0, 0)';
      profileBlock.style.borderOpacity = '0';
      profileBlock.style.borderColor = 'transparent';
      profileBlock.style.backdropFilter = 'none';
      skillsBlock.style.background = 'rgba(0, 0, 0, 0)';
      skillsBlock.style.borderOpacity = '0';
      skillsBlock.style.borderColor = 'transparent';
      skillsBlock.style.backdropFilter = 'none';
   
      profileBlock.style.pointerEvents = 'auto';
      socialIcons.forEach(icon => {
        icon.style.pointerEvents = 'auto';
        icon.style.opacity = '1';
      });
      badges.forEach(badge => {
        badge.style.pointerEvents = 'auto';
        badge.style.opacity = '1';
      });
      profilePicture.style.pointerEvents = 'auto';
      profilePicture.style.opacity = '1';
      profileName.style.opacity = '1';
      profileBio.style.opacity = '1';
      visitorCount.style.opacity = '1';
    } else {
      profileBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
      profileBlock.style.borderOpacity = opacity;
      profileBlock.style.borderColor = '';
      profileBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
      skillsBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
      skillsBlock.style.borderOpacity = opacity;
      skillsBlock.style.borderColor = '';
      skillsBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
      profileBlock.style.pointerEvents = 'auto';
      socialIcons.forEach(icon => {
        icon.style.pointerEvents = 'auto';
        icon.style.opacity = '1';
      });
      badges.forEach(badge => {
        badge.style.pointerEvents = 'auto';
        badge.style.opacity = '1';
      });
      profilePicture.style.pointerEvents = 'auto';
      profilePicture.style.opacity = '1';
      profileName.style.opacity = '1';
      profileBio.style.opacity = '1';
      visitorCount.style.opacity = '1';
    }
  });


  function switchTheme(videoSrc, audio, themeClass, overlay = null, overlayOverProfile = false) {
    let primaryColor;
    switch (themeClass) {
      case 'home-theme':
        primaryColor = '#00CED1';
        break;
      case 'hacker-theme':
        primaryColor = '#22C55E';
        break;
      case 'rain-theme':
        primaryColor = '#1E3A8A';
        break;
      case 'anime-theme':
        primaryColor = '#DC2626';
        break;
      case 'car-theme':
        primaryColor = '#EAB308';
        break;
      default:
        primaryColor = '#00CED1';
    }
    document.documentElement.style.setProperty('--primary-color', primaryColor);

    gsap.to(backgroundVideo, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        backgroundVideo.src = videoSrc;

        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        currentAudio = audio;
        currentAudio.volume = volumeSlider.value;
        currentAudio.muted = isMuted;
        currentAudio.play().catch(err => console.error("Failed to play theme music:", err));

        document.body.classList.remove('home-theme', 'hacker-theme', 'rain-theme', 'anime-theme', 'car-theme');
        document.body.classList.add(themeClass);

        hackerOverlay.classList.add('hidden');
        snowOverlay.classList.add('hidden');
        profileBlock.style.zIndex = overlayOverProfile ? 10 : 20;
        skillsBlock.style.zIndex = overlayOverProfile ? 10 : 20;
        if (overlay) {
          overlay.classList.remove('hidden');
        }

        if (themeClass === 'hacker-theme') {
          resultsButtonContainer.classList.remove('hidden');
        } else {
          resultsButtonContainer.classList.add('hidden');
          skillsBlock.classList.add('hidden');
          resultsHint.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.to(profileBlock, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
        }

        gsap.to(backgroundVideo, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            profileContainer.classList.remove('orbit');
            void profileContainer.offsetWidth;
            profileContainer.classList.add('orbit');
          }
        });
      }
    });
  }


  homeButton.addEventListener('click', () => {
    switchTheme('assets/background.mp4', backgroundMusic, 'home-theme');
  });
  homeButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    switchTheme('assets/background.mp4', backgroundMusic, 'home-theme');
  });

  hackerButton.addEventListener('click', () => {
    switchTheme('assets/hacker_background.mp4', hackerMusic, 'hacker-theme', hackerOverlay, false);
  });
  hackerButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    switchTheme('assets/hacker_background.mp4', hackerMusic, 'hacker-theme', hackerOverlay, false);
  });

  rainButton.addEventListener('click', () => {
    switchTheme('assets/rain_background.mov', rainMusic, 'rain-theme', snowOverlay, true);
  });
  rainButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    switchTheme('assets/rain_background.mov', rainMusic, 'rain-theme', snowOverlay, true);
  });

  animeButton.addEventListener('click', () => {
    switchTheme('assets/anime_background.mp4', animeMusic, 'anime-theme');
  });
  animeButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    switchTheme('assets/anime_background.mp4', animeMusic, 'anime-theme');
  });

  carButton.addEventListener('click', () => {
    switchTheme('assets/car_background.mp4', carMusic, 'car-theme');
  });
  carButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    switchTheme('assets/car_background.mp4', carMusic, 'car-theme');
  });

 
  function handleTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let clientX, clientY;

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    const maxTilt = 15;
    const tiltX = (mouseY / rect.height) * maxTilt;
    const tiltY = -(mouseX / rect.width) * maxTilt;

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  }

  profileBlock.addEventListener('mousemove', (e) => handleTilt(e, profileBlock));
  profileBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, profileBlock);
  });

  skillsBlock.addEventListener('mousemove', (e) => handleTilt(e, skillsBlock));
  skillsBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, skillsBlock);
  });

  if (discordStatusBlock) {
    discordStatusBlock.addEventListener('mousemove', (e) => handleTilt(e, discordStatusBlock));
    discordStatusBlock.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleTilt(e, discordStatusBlock);
    });

    discordStatusBlock.addEventListener('mouseleave', () => {
      gsap.to(discordStatusBlock, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
    discordStatusBlock.addEventListener('touchend', () => {
      gsap.to(discordStatusBlock, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  }

  profileBlock.addEventListener('mouseleave', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  profileBlock.addEventListener('touchend', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  skillsBlock.addEventListener('mouseleave', () => {
    gsap.to(skillsBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  skillsBlock.addEventListener('touchend', () => {
    gsap.to(skillsBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });


  profilePicture.addEventListener('mouseenter', () => {
    glitchOverlay.style.opacity = '1';
    setTimeout(() => {
      glitchOverlay.style.opacity = '0';
    }, 500);
  });


  profilePicture.addEventListener('click', () => {
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

  profilePicture.addEventListener('touchstart', (e) => {
    e.preventDefault();
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

 
  let isShowingSkills = false;
  resultsButton.addEventListener('click', () => {
    if (!isShowingSkills) {
      gsap.to(profileBlock, {
        x: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          profileBlock.classList.add('hidden');
          skillsBlock.classList.remove('hidden');
          gsap.fromTo(skillsBlock,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
          gsap.to(pythonBar, { width: '87%', duration: 2, ease: 'power2.out' });
          gsap.to(cppBar, { width: '75%', duration: 2, ease: 'power2.out' });
          gsap.to(csharpBar, { width: '80%', duration: 2, ease: 'power2.out' });
        }
      });
      resultsHint.classList.remove('hidden');
      isShowingSkills = true;
    } else {
      gsap.to(skillsBlock, {
        x: 100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          skillsBlock.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.fromTo(profileBlock,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
      resultsHint.classList.add('hidden');
      isShowingSkills = false;
    }
  });

  resultsButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!isShowingSkills) {
      gsap.to(profileBlock, {
        x: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          profileBlock.classList.add('hidden');
          skillsBlock.classList.remove('hidden');
          gsap.fromTo(skillsBlock,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
          gsap.to(pythonBar, { width: '87%', duration: 2, ease: 'power2.out' });
          gsap.to(cppBar, { width: '75%', duration: 2, ease: 'power2.out' });
          gsap.to(csharpBar, { width: '80%', duration: 2, ease: 'power2.out' });
        }
      });
      resultsHint.classList.remove('hidden');
      isShowingSkills = true;
    } else {
      gsap.to(skillsBlock, {
        x: 100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          skillsBlock.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.fromTo(profileBlock,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
      resultsHint.classList.add('hidden');
      isShowingSkills = false;
    }
  });


  typeWriterStart();
});