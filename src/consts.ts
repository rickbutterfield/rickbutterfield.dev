// Global site data, sourced from the Settings tab on the Home node in Umbraco.
// The literals are fallbacks for when the fields are empty.
import { getCollection } from 'astro:content';

const [homePage] = await getCollection('homePage');
const settings = homePage?.data.content.properties;

export const SITE_TITLE = settings?.siteTitle || 'Rick Butterfield';
export const SITE_TITLE_MOBILE = settings?.siteTitleMobile || 'RB';
export const SITE_DESCRIPTION = settings?.siteDescription || 'Senior Developer at Umbraco';
export const SITE_JOB_TITLE = 'Staff Engineer';
export const SITE_EMPLOYER = 'Umbraco';
