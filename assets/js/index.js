//! Api Key
const NASA_API_KEY = 'TN9s1xPWPKgJMlSPL285Jhw0pTO1wH8E6rzzvH0E';

// DOM Elements
const fetchTodayApodBtn = document.getElementById('today-apod-btn');
const customDateInput = document.getElementById('apod-date-input');
const customDateBtn = document.getElementById('load-date-btn');
const apodDateInfoInputValue = document.getElementById('apod-date-info-input');
apodDateInfoInputValue.textContent = customDateInput.value;

// Date
const today = new Date().toISOString().split('T')[0];
customDateInput.max = today;
customDateInput.value = today;
apodDateInfoInputValue.textContent = today;

// Event Listeners
fetchTodayApodBtn.addEventListener('click', () => nasaApodAPI());

customDateInput.addEventListener('input', () => {
  apodDateInfoInputValue.textContent = customDateInput.value;
});

customDateBtn.addEventListener('click', () => {
  nasaApodAPI(customDateInput.value);
  console.log(customDateInput.value);
});

// Format Numbers
const formatNumber = (value, options = {}) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    ...options,
  }).format(value);

const formatScientific = (value, exponent) =>
  `${value} × 10<sup>${exponent}</sup>`;

// Normal Functions
function toggleSidebar() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');

  let overlay = null;

  sidebarToggle.addEventListener('click', handleToggle);

  function handleToggle() {
    const isOpen = sidebar.classList.toggle('sidebar-open');

    if (isOpen) {
      createOverlay();
    } else {
      removeOverlay();
    }
  }

  function createOverlay() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';

    overlay.addEventListener('click', closeSidebar);
    document.body.appendChild(overlay);
  }

  function removeOverlay() {
    overlay?.remove();
    overlay = null;
  }

  function closeSidebar() {
    sidebar.classList.remove('sidebar-open');
    removeOverlay();
  }
}

function openSections() {
  const sections = document.querySelectorAll('section[id]');
  const nav = document.querySelector('nav');
  const links = nav.querySelectorAll('a[data-section]');
  const sidebar = document.getElementById('sidebar');

  nav.addEventListener('click', function (event) {
    const link = event.target.closest('a[data-section]');
    if (link === null) {
      return;
    }

    const targetId = link.getAttribute('data-section');

    for (let i = 0; i < sections.length; i++) {
      if (sections[i].id !== targetId) {
        sections[i].classList.add('hidden');
      } else {
        sections[i].classList.remove('hidden');
      }
    }

    for (let i = 0; i < links.length; i++) {
      links[i].classList.remove('bg-blue-500/10');
      links[i].classList.remove('text-blue-400');
      links[i].classList.add('text-slate-300');
      links[i].classList.add('hover:bg-slate-800');
    }

    link.classList.add('bg-blue-500/10');
    link.classList.add('text-blue-400');
    link.classList.remove('text-slate-300');
    link.classList.remove('hover:bg-slate-800');

    switch (targetId) {
      case 'today-in-space':
        nasaApodAPI();
        break;
      case 'launches':
        spaceDevsLaunchesAPI();
        break;
      case 'planets':
        solarSystemOpenData();
        break;
      default:
        break;
    }

    sidebar.classList.remove('sidebar-open');
    document.querySelector('.sidebar-overlay')?.remove();
  });
}

// async Api Functions
async function nasaApodAPI(customDate) {
  const headerDate = document.getElementById('apod-date');
  const headerTitle = document.getElementById('apod-title');
  const image = document.getElementById('apod-image');
  const explanation = document.getElementById('apod-explanation');
  const headerDateInfo = document.getElementById('apod-date-info');
  const copyright = document.getElementById('apod-copyright');
  const dateDetail = document.getElementById('apod-date-detail');
  const mediaType = document.getElementById('apod-media-type');
  const fullResolutionBtn = document.getElementById('apod-full-resolution-btn');

  headerDate.textContent = 'Loading...';
  headerTitle.textContent = 'Loading...';
  image.src = './assets/images/placeholder.webp';
  image.alt = 'Loading image...';
  explanation.textContent = 'Loading explanation...';
  headerDateInfo.textContent = 'loading...';
  copyright.textContent = 'loading...';
  dateDetail.textContent = 'loading...';
  mediaType.textContent = 'loading...';

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${
        customDate ? `&date=${customDate}` : ''
      }`
    );

    if (!response.ok) {
      throw new Error(`New Error: Response Not OK => ${response.status}`);
    }

    const data = await response.json();

    const {
      date,
      title,
      url,
      explanation: desc,
      copyright: cp,
      media_type,
    } = data;

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    headerDate.textContent = formattedDate;
    headerTitle.textContent = title;
    image.src = url;
    image.alt = title;
    explanation.textContent = desc;
    headerDateInfo.textContent = formattedDate;
    copyright.innerHTML = cp ? `&copy; ${cp}` : '&copy; Public Domain';
    dateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${formattedDate}`;
    mediaType.textContent = media_type;
    fullResolutionBtn.onclick = () => window.open(url, '_blank');
  } catch (err) {
    console.error(`Error from nasaApodAPI`);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${err}`,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626',
      showConfirmButton: true,
      showCloseButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
      allowBackspace: true,
    });

    headerTitle.textContent = 'No Data Available';
    explanation.textContent =
      'No space image is available for this date. Please choose another date.';
    image.src = './assets/images/placeholder.webp';
    image.alt = 'No image available';
    headerDateInfo.textContent = 'No Data Available';
    copyright.textContent = 'No Data Available';
    dateDetail.textContent = 'No Data Available';
    mediaType.textContent = 'No Data Available';
    fullResolutionBtn.disabled = true;
    fullResolutionBtn.classList.add('opacity-50');
  }
}

async function spaceDevsLaunchesAPI(limitNumber = 10) {
  const featuredLaunchTitle = document.getElementById('featured-launch-title');
  const featuredLaunchStatus = document.getElementById(
    'featured-launch-status'
  );
  const featuredLaunchSpaceCredit = document.getElementById(
    'featured-launch-space-credit'
  );
  const featuredLaunchRocketCredit = document.getElementById(
    'featured-launch-rocket-credit'
  );
  const featuredLaunchCountdown = document.getElementById(
    'featured-launch-countdown'
  );
  const featuredLaunchCountdownContainer = document.getElementById(
    'featured-launch-countdown-container'
  );
  const featuredLaunchDate = document.getElementById('featured-launch-date');
  const featuredLaunchTime = document.getElementById('featured-launch-time');
  const featuredLaunchLocation = document.getElementById(
    'featured-launch-location'
  );
  const featuredLaunchCountry = document.getElementById(
    'featured-launch-country'
  );
  const featuredLaunchDescription = document.getElementById(
    'featured-launch-description'
  );
  const featuredLaunchDetailsButton = document.getElementById(
    'featured-launch-details-button'
  );
  const featuredLaunchImage = document.getElementById('featured-launch-image');

  const launchesGrid = document.getElementById('launches-grid');

  featuredLaunchTitle.textContent = 'Loading...';
  featuredLaunchStatus.textContent = 'Loading...';
  featuredLaunchSpaceCredit.textContent = 'Loading...';
  featuredLaunchRocketCredit.textContent = 'Loading...';
  featuredLaunchCountdown.textContent = '';
  featuredLaunchDate.textContent = '';
  featuredLaunchTime.textContent = '';
  featuredLaunchLocation.textContent = '';
  featuredLaunchCountry.textContent = '';
  featuredLaunchDescription.textContent = '';
  featuredLaunchImage.src = './assets/images/launch-placeholder.png';

  launchesGrid.innerHTML = `
  <div class="loader-container"><div class="loader"></div></div>
  <div class="loader-container"><div class="loader"></div></div>
  <div class="loader-container"><div class="loader"></div></div>
  `;

  try {
    const response = await fetch(
      `https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=${limitNumber}`
    );

    if (!response.ok) {
      throw new Error(`Response Not OK => ${response.status}`);
    }

    const data = await response.json();
    const launch = data.results[0];

    featuredLaunchDetailsButton.onclick = () => {
      window.open(launch.url, '_blank');
    };

    featuredLaunchTitle.textContent = launch.name;
    featuredLaunchStatus.textContent = launch.status.abbrev;
    featuredLaunchSpaceCredit.textContent = launch.image?.credit || 'Unknown';
    featuredLaunchRocketCredit.textContent =
      launch.rocket?.configuration?.full_name || 'Unknown';

    if (launch.net) {
      const launchDate = new Date(launch.net);
      const now = new Date();

      const diffMs = launchDate - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        featuredLaunchCountdown.textContent = `${diffDays} Days Until Launch`;
      } else {
        featuredLaunchCountdown.textContent = 'Launched';
      }
    } else {
      featuredLaunchCountdownContainer.style.display = 'none';
    }

    featuredLaunchDate.textContent = new Date(launch.net).toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
    const launchTime = new Date(launch.net).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });

    featuredLaunchTime.textContent = `${launchTime} UTC`;

    featuredLaunchLocation.textContent = launch.pad.location?.name || 'Unknown';
    featuredLaunchCountry.textContent = launch.pad.country?.name || 'Unknown';
    featuredLaunchDescription.textContent =
      launch.mission?.description || 'Unknown';
    featuredLaunchImage.src =
      launch.image?.image_url || './assets/images/launch-placeholder.png';
    featuredLaunchImage.alt = launch.image?.name || 'Unknown';

    for (let i = 1; i < data.results.length; i++) {
      const launch = data.results[i];

      launchesGrid.innerHTML += `
    <div
      class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer flex flex-col justify-between"
    >
      <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
        <img
          src="${
            launch.image?.image_url || './assets/images/launch-placeholder.png'
          }"
          alt="${launch.name}"
          class="w-full h-full object-cover"
        />
        <div class="absolute top-3 right-3">
          <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
            ${launch.status?.abbrev || 'Go'}
          </span>
        </div>
      </div>
      <div class="p-5">
        <div class="mb-3">
          <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            ${launch.name}
          </h4>
          <p class="text-sm text-slate-400 flex items-center gap-2">
            <i class="fas fa-building text-xs"></i>
            ${launch.launch_service_provider?.name || 'Unknown'}
          </p>
        </div>
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-calendar text-slate-500 w-4"></i>
            <span class="text-slate-300">
              ${new Date(launch.net).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-clock text-slate-500 w-4"></i>
            <span class="text-slate-300">
              ${new Date(launch.net).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC',
              })} UTC
            </span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-rocket text-slate-500 w-4"></i>
            <span class="text-slate-300">
              ${launch.rocket?.configuration?.full_name || 'Unknown'}
            </span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
            <span class="text-slate-300 line-clamp-1">
              ${launch.pad.location?.name || 'Unknown'}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
          <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
          onclick="window.open('${launch.url}', '_blank')"
          >
            Details
          </button>
          <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
      document
        .querySelectorAll('.loader-container')
        ?.forEach(loader => loader.remove());
    }
  } catch (err) {
    console.error(`Error from spaceDevsLaunchesAPI`);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${err}`,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626',
      showConfirmButton: true,
      showCloseButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
      allowBackspace: true,
    });

    featuredLaunchTitle.textContent = 'No Data Available';
    featuredLaunchStatus.textContent = 'No Data Available';
    featuredLaunchSpaceCredit.textContent = 'No Data Available';
    featuredLaunchRocketCredit.textContent = 'No Data Available';
    featuredLaunchCountdownContainer.style.display = 'none';
    featuredLaunchDate.textContent = 'No Data Available';
    featuredLaunchTime.textContent = 'No Data Available';
    featuredLaunchLocation.textContent = 'No Data Available';
    featuredLaunchCountry.textContent = 'No Data Available';
    featuredLaunchDescription.textContent = 'No Data Available';
    featuredLaunchImage.src = './assets/images/launch-placeholder.png';
    featuredLaunchImage.alt = 'No Data Available';

    launchesGrid.innerHTML = `
  <div class="loader-container"><div class="loader"></div></div>
  <div class="loader-container"><div class="loader"></div></div>
  <div class="loader-container"><div class="loader"></div></div>
  `;
  }
}

async function solarSystemOpenData() {
  const planetCards = document.querySelectorAll('div[data-planet-id]');

  try {
    const response = await fetch(
      'https://solar-system-opendata-proxy.vercel.app/api/planets'
    );

    if (!response.ok) {
      throw new Error(`Response Not OK => ${response.status}`);
    }

    const data = await response.json();
    const planets = data.bodies;

    const planetsMap = new Map(
      planets.map(planet => [planet.englishName.toLowerCase(), planet])
    );

    planetCards.forEach(card => {
      const planetId = card.dataset.planetId.toLowerCase();
      const planetData = planetsMap.get(planetId);

      if (!planetData) return;

      const imgElement = card.querySelector('img');
      imgElement.src = planetData.image;
      imgElement.alt = planetData.englishName;

      card.addEventListener('click', () => {
        updatePlanetDetails(planetData);
        renderPlanetFacts(planetData);
      });
    });

    renderPlanetsComparison(planets);
  } catch (err) {
    console.error('Error from solarSystemOpenData:', err);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${err}`,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626',
      showConfirmButton: true,
      showCloseButton: true,
    });
  }
}

// helper functions
function updatePlanetDetails(planet) {
  const imgElement = document.getElementById('planet-detail-image');
  const nameElement = document.getElementById('planet-detail-name');
  const descriptionElement = document.getElementById(
    'planet-detail-description'
  );
  const planetDistanceElement = document.getElementById('planet-distance');
  const planetRadiusElement = document.getElementById('planet-radius');
  const planetMassElement = document.getElementById('planet-mass');
  const planetDensityElement = document.getElementById('planet-density');
  const planetOrbitalPeriodElement = document.getElementById(
    'planet-orbital-period'
  );
  const planetRotationElement = document.getElementById('planet-rotation');
  const planetMoonsElement = document.getElementById('planet-moons');
  const planetGravityElement = document.getElementById('planet-gravity');
  const planetDiscovererElement = document.getElementById('planet-discoverer');
  const planetDiscoveryDateElement = document.getElementById(
    'planet-discovery-date'
  );
  const planetBodyTypeElement = document.getElementById('planet-body-type');
  const planetVolumeElement = document.getElementById('planet-volume');
  const planetPerihelionElement = document.getElementById('planet-perihelion');
  const planetAphelionElement = document.getElementById('planet-aphelion');
  const planetEccentricityElement = document.getElementById(
    'planet-eccentricity'
  );
  const planetInclinationElement =
    document.getElementById('planet-inclination');
  const planetAxialTiltElement = document.getElementById('planet-axial-tilt');
  const planetTemperatureElement = document.getElementById('planet-temp');
  const planetEscapeElement = document.getElementById('planet-escape');

  const learnMoreButton = document.getElementById('learn-more-button');

  learnMoreButton.addEventListener('click', () => {
    window.open(
      `https://en.wikipedia.org/wiki/${planet.englishName}`,
      '_blank'
    );
  });

  // Start Updating Information
  imgElement.src = planet.image || './assets/images/earth.png';
  imgElement.alt = planet.englishName;
  nameElement.textContent = planet.englishName;
  descriptionElement.textContent =
    planet.description ||
    `${planet.englishName} is a fascinating celestial body in our solar system.`;

  planetDistanceElement.textContent = planet.semimajorAxis
    ? `${formatNumber(planet.semimajorAxis / 1e6)} M km`
    : 'N/A';

  planetRadiusElement.textContent = planet.meanRadius
    ? `${formatNumber(planet.meanRadius)} km`
    : 'N/A';

  planetMassElement.innerHTML = planet.mass
    ? `${formatScientific(planet.mass.massValue, planet.mass.massExponent)} kg`
    : 'N/A';

  planetDensityElement.textContent = planet.density
    ? `${formatNumber(planet.density)} g/cm³`
    : 'N/A';

  planetOrbitalPeriodElement.textContent = planet.sideralOrbit
    ? `${formatNumber(planet.sideralOrbit)} days`
    : 'N/A';

  planetRotationElement.textContent = planet.sideralRotation
    ? `${formatNumber(planet.sideralRotation)} hours`
    : 'N/A';

  planetMoonsElement.textContent = planet.moons
    ? formatNumber(planet.moons.length)
    : 'N/A';

  planetGravityElement.textContent = planet.gravity
    ? `${formatNumber(planet.gravity)} m/s²`
    : 'N/A';

  planetDiscovererElement.textContent =
    planet.discoveredBy || 'Known since antiquity';

  planetDiscoveryDateElement.textContent =
    planet.discoveryDate || 'Ancient times';

  planetBodyTypeElement.textContent = planet.type || 'N/A';

  planetVolumeElement.innerHTML = planet.vol
    ? `${formatScientific(planet.vol.volValue, planet.vol.volExponent)} km³`
    : 'N/A';

  // Orbital Characteristics

  planetPerihelionElement.textContent = planet.perihelion
    ? `${formatNumber(planet.perihelion / 1e6)} M km`
    : 'N/A';

  planetAphelionElement.textContent = planet.aphelion
    ? `${formatNumber(planet.aphelion / 1e6)} M km`
    : 'N/A';

  planetEccentricityElement.textContent = planet.eccentricity
    ? `${formatNumber(planet.eccentricity)}`
    : 'N/A';

  planetInclinationElement.textContent = planet.inclination
    ? `${formatNumber(planet.inclination)}`
    : 'N/A';

  planetAxialTiltElement.textContent = planet.axialTilt
    ? `${formatNumber(planet.axialTilt)}`
    : 'N/A';

  planetTemperatureElement.textContent = planet.avgTemp
    ? `${formatNumber(planet.avgTemp)} °C`
    : 'N/A';

  planetEscapeElement.textContent = planet.escape
    ? `${formatNumber(planet.escape)} m/s`
    : 'N/A';
}

function renderPlanetFacts(planet) {
  const factsList = document.getElementById('planet-facts');
  if (!factsList || !planet) return;

  const facts = [
    planet.mass && {
      text: `Mass: ${formatScientific(
        planet.mass.massValue,
        planet.mass.massExponent
      )} kg`,
    },
    planet.gravity && {
      text: `Surface gravity: ${formatNumber(planet.gravity)} m/s²`,
    },
    planet.density && {
      text: `Density: ${formatNumber(planet.density, 4)} g/cm³`,
    },
    planet.axialTilt && {
      text: `Axial tilt: ${formatNumber(planet.axialTilt)}°`,
    },
  ].filter(Boolean);

  factsList.innerHTML = '';

  facts.forEach(({ text }) => {
    const li = document.createElement('li');
    li.className = 'flex items-start';

    li.innerHTML = `
      <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
      <span class="text-slate-300">${text}</span>
    `;

    factsList.appendChild(li);
  });
}

function renderPlanetsComparison(planets) {
  if (!planets) return;

  planets.forEach(planet => {
    const planetRow = document.getElementById('planet-comparison-tbody');

    planetRow.innerHTML += `
       <tr class="hover:bg-slate-800/30 transition-colors">
          <td
            class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10"
          >
            <div class="flex items-center space-x-2 md:space-x-3">
              <div
                class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
              >
                <img src="${planet.image}" alt="${planet.englishName}" />
              </div>
              <span
                class="font-semibold text-sm md:text-base whitespace-nowrap"
                >${planet.englishName}</span
              >
            </div>
          </td>
          <td
            class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
          >
            ${formatNumber(planet.semimajorAxis / 1e6)}
          </td>
          <td
            class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
          >
            ${formatNumber(planet.meanRadius)} km
          </td>
          <td
            class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
          >
            ${formatScientific(
              planet.mass.massValue,
              planet.mass.massExponent
            )} kg
          </td>
          <td
            class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
          >
           ${formatNumber(planet.sideralOrbit)} days
          </td>
          <td
            class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
          >
           ${planet.moons ? formatNumber(planet.moons.length) : '0'}
          </td>
          <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
            <span
              class="px-2 py-1 rounded text-xs bg-orange-500/50 text-orange-200"
              >${planet.type}</span
            >
          </td>
        </tr>
    `;
  });
}

// =========================================================================>> Render Document First
function startRender() {
  const init = () => {
    openSections();
    toggleSidebar();
    nasaApodAPI();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
startRender();
// =========================================================================>>
