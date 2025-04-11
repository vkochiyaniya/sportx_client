/**
 * Central icon mapping file for the SportX application
 * This file standardizes all icons used throughout the application
 * to make future changes easier to manage.
 */

// Import Chakra UI icons
import {
  StarIcon,
  CheckCircleIcon,
  TimeIcon,
  InfoIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MinusIcon,
  AddIcon,
  SmallAddIcon,
  ExternalLinkIcon,
  ArrowBackIcon,
  ViewIcon,
  ViewOffIcon,
  DeleteIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RepeatIcon,
  MoonIcon,
  SunIcon
} from '@chakra-ui/icons';

// Import Feather icons - only the most commonly used ones
import {
  FiShoppingCart,
  FiUser,
  FiHome,
  FiSearch,
  FiFilter,
  FiSettings,
  FiLogOut,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiCheck,
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiArrowUp,
  FiArrowDown,
  FiChevronRight,
  FiChevronLeft,
  FiChevronUp,
  FiChevronDown,
  FiEye,
  FiEyeOff,
  FiHeart,
  FiShare,
  FiStar,
  FiClock,
  FiInfo,
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiMail,
  FiLock,
  FiUnlock,
  FiUserPlus,
  FiUserMinus,
  FiUserCheck,
  FiUserX,
  FiShoppingBag,
  FiCreditCard,
  FiTruck,
  FiPackage,
  FiBox,
  FiGift,
  FiTag,
  FiPercent,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiMessageSquare,
  FiMessageCircle,
  FiSend,
  FiImage,
  FiCamera,
  FiVideo,
  FiMusic,
  FiHeadphones,
  FiMic,
  FiMicOff,
  FiVolume,
  FiVolume1,
  FiVolumeX,
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiRewind,
  FiFastForward,
  FiShuffle,
  FiRepeat,
  FiMaximize,
  FiMinimize,
  FiZoomIn,
  FiZoomOut,
  FiGrid,
  FiList,
  FiMenu,
  FiMoreHorizontal,
  FiMoreVertical,
  FiSliders,
  FiTool,
  FiHelpCircle,
  FiBookmark,
  FiBookOpen,
  FiBook,
  FiFile,
  FiFileText,
  FiFolder,
  FiFolderPlus,
  FiFolderMinus,
  FiDownload,
  FiUpload,
  FiDownloadCloud,
  FiUploadCloud,
  FiCloud,
  FiCloudRain,
  FiCloudSnow,
  FiCloudLightning,
  FiCloudDrizzle,
  FiCloudOff,
  FiSun,
  FiMoon,
  FiSunrise,
  FiSunset
} from 'react-icons/fi';

// Export the icon mapping
export const iconMapping = {
  // Chakra UI icons
  star: StarIcon,
  checkCircle: CheckCircleIcon,
  time: TimeIcon,
  info: InfoIcon,
  chevronRight: ChevronRightIcon,
  chevronLeft: ChevronLeftIcon,
  minus: MinusIcon,
  add: AddIcon,
  smallAdd: SmallAddIcon,
  externalLink: ExternalLinkIcon,
  arrowBack: ArrowBackIcon,
  view: ViewIcon,
  viewOff: ViewOffIcon,
  delete: DeleteIcon,
  chevronDown: ChevronDownIcon,
  chevronUp: ChevronUpIcon,
  close: CloseIcon,
  search: SearchIcon,
  arrowUp: ArrowUpIcon,
  arrowDown: ArrowDownIcon,
  repeat: RepeatIcon,
  moon: MoonIcon,
  sun: SunIcon,
  
  // Feather icons
  shoppingCart: FiShoppingCart,
  user: FiUser,
  home: FiHome,
  searchIcon: FiSearch, // Renamed to avoid duplicate
  filter: FiFilter,
  settings: FiSettings,
  logout: FiLogOut,
  edit: FiEdit,
  trash: FiTrash2,
  plus: FiPlus,
  minusIcon: FiMinus, // Renamed to avoid duplicate
  check: FiCheck,
  x: FiX,
  arrowRight: FiArrowRight,
  arrowLeft: FiArrowLeft,
  arrowUpIcon: FiArrowUp, // Renamed to avoid duplicate
  arrowDownIcon: FiArrowDown, // Renamed to avoid duplicate
  chevronRightIcon: FiChevronRight, // Renamed to avoid duplicate
  chevronLeftIcon: FiChevronLeft, // Renamed to avoid duplicate
  chevronUpIcon: FiChevronUp, // Renamed to avoid duplicate
  chevronDownIcon: FiChevronDown, // Renamed to avoid duplicate
  eye: FiEye,
  eyeOff: FiEyeOff,
  heart: FiHeart,
  share: FiShare,
  starIcon: FiStar, // Renamed to avoid duplicate
  clock: FiClock,
  infoIcon: FiInfo, // Renamed to avoid duplicate
  alertCircle: FiAlertCircle,
  alertTriangle: FiAlertTriangle,
  checkCircleIcon: FiCheckCircle, // Renamed to avoid duplicate
  xCircle: FiXCircle,
  mail: FiMail,
  lock: FiLock,
  unlock: FiUnlock,
  userPlus: FiUserPlus,
  userMinus: FiUserMinus,
  userCheck: FiUserCheck,
  userX: FiUserX,
  shoppingBag: FiShoppingBag,
  creditCard: FiCreditCard,
  truck: FiTruck,
  package: FiPackage,
  box: FiBox,
  gift: FiGift,
  tag: FiTag,
  percent: FiPercent,
  dollarSign: FiDollarSign,
  calendar: FiCalendar,
  mapPin: FiMapPin,
  phone: FiPhone,
  messageSquare: FiMessageSquare,
  messageCircle: FiMessageCircle,
  send: FiSend,
  image: FiImage,
  camera: FiCamera,
  video: FiVideo,
  music: FiMusic,
  headphones: FiHeadphones,
  mic: FiMic,
  micOff: FiMicOff,
  volume: FiVolume,
  volume1: FiVolume1,
  volumeX: FiVolumeX,
  play: FiPlay,
  pause: FiPause,
  skipBack: FiSkipBack,
  skipForward: FiSkipForward,
  rewind: FiRewind,
  fastForward: FiFastForward,
  shuffle: FiShuffle,
  repeatIcon: FiRepeat, // Renamed to avoid duplicate
  maximize: FiMaximize,
  minimize: FiMinimize,
  zoomIn: FiZoomIn,
  zoomOut: FiZoomOut,
  grid: FiGrid,
  list: FiList,
  menu: FiMenu,
  moreHorizontal: FiMoreHorizontal,
  moreVertical: FiMoreVertical,
  sliders: FiSliders,
  tool: FiTool,
  helpCircle: FiHelpCircle,
  bookmark: FiBookmark,
  bookOpen: FiBookOpen,
  book: FiBook,
  file: FiFile,
  fileText: FiFileText,
  folder: FiFolder,
  folderPlus: FiFolderPlus,
  folderMinus: FiFolderMinus,
  download: FiDownload,
  upload: FiUpload,
  downloadCloud: FiDownloadCloud,
  uploadCloud: FiUploadCloud,
  cloud: FiCloud,
  cloudRain: FiCloudRain,
  cloudSnow: FiCloudSnow,
  cloudLightning: FiCloudLightning,
  cloudDrizzle: FiCloudDrizzle,
  cloudOff: FiCloudOff,
  sunIcon: FiSun, // Renamed to avoid duplicate
  moonIcon: FiMoon, // Renamed to avoid duplicate
  sunrise: FiSunrise,
  sunset: FiSunset
};

// Helper function to get an icon by name
export const getIcon = (name) => {
  return iconMapping[name] || null;
};

// Helper function to render a star rating
export const renderStars = (rating, maxStars = 5) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FiStar key={`star-${i}`} />);
  }
  
  if (hasHalfStar) {
    stars.push(<FiStar key="half-star" />);
  }
  
  const emptyStars = maxStars - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FiStar key={`empty-star-${i}`} />);
  }
  
  return stars;
}; 