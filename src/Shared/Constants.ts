/**
 * @fileoverview Constants used throughout the application
 */

/* eslint-disable no-unused-vars */
/**
 * External links used in the application for documentation, support, and resources
 * Probably should be used when app fills with more text and explanations for the user
 * @enum {string}
 */
export enum ExternalLinks {
  About = 'https://spacemesh.io/',
  UserGuide = 'https://github.com/spacemeshos/wiki/wiki/Smesher-Guide',
  Terms = 'https://testnet.spacemesh.io/#/terms', // TODO: update link, Yaeli or Danielle will provide the correct one
  Disclaimer = 'https://testnet.spacemesh.io/#/disclaimer', // TODO: update link, Yaeli or Danielle will provide the correct one
  Discord = 'https://discord.com/invite/yVhQ7rC',
  Privacy = 'https://testnet.spacemesh.io/#/privacy', // TODO: update link, Yaeli or Danielle will provide the correct one
  NoSleepGuide = 'https://github.com/spacemeshos/smapp/wiki/User-Support#disabling-sleep-mode',
  Help = 'https://github.com/spacemeshos/smapp/wiki/User-Support#getting-help',
  RedistWindowsInstallOfficialSite = 'https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2015-2017-2019-and-2022',
  OpenCLWindowsInstallGuide = 'https://sasview.org/docs/old_docs/4.1.2/user/opencl_installation.html',
  OpenCLUbuntuInstallGuide = 'https://saturncloud.io/blog/how-to-install-cudaopencl-on-ubuntu-installed-on-a-usb-drive/#installing-opencl',
  Requirements = 'https://docs.spacemesh.io/docs/start/smeshing/requirements',
  Docs = 'https://docs.spacemesh.io/docs/start',
  Report = 'https://github.com/spacemeshos/sm-init-app-v2/issues/new',
}
/* eslint-enable no-unused-vars */

/**
 * Constants related to size calculations and storage management
 * Used by sizeUtils.tsx for various calculations
 */
export const SizeConstants = {
  CYCLE_GAP_HOURS: 12, // 12 hours - network configuration

  /** Safety period coefficient for data processing (0.7 means 70% of available time) */
  K_SAFE_PERIOD: 0.7,

  /** Default number of units for size calculations */
  DEFAULT_NUM_UNITS: 4,

  /** Default maximum file size in MiB (4096 MiB = 4 GiB) */
  DEFAULT_MAX_FILE_SIZE_MIB: 4096,

  /** Size of one Space Unit in GiB - network configuration*/
  UNIT_SIZE_GIB: 64,

  /** Array of size units for formatting
   * Follows binary prefix convention (powers of 1024)  
   */
  SIZE_UNITS: ['GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'] as const,
};
