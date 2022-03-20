import { I18n } from 'i18n';
import { join } from 'path';

const lang = new I18n();

lang.configure({
  directory: join(__dirname, 'locales'),
  defaultLocale: 'id',
});

export default lang;
