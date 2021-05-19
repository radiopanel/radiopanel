import { enableProdMode } from '@angular/core';
import { persistState } from '@datorama/akita';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CoreModule } from './app/core/core.module';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();

	Sentry.init({
		dsn: 'https://d9ccbd4bdbac4176ad7dc16293d8f50d@o444371.ingest.sentry.io/5419982',
		integrations: [
		  new Integrations.BrowserTracing({
			tracingOrigins: ['localhost', 'https://app.radiopanel.co'],
			routingInstrumentation: Sentry.routingInstrumentation,
		  }),
		],
		tracesSampleRate: 1.0,
	});
}

const storage = persistState({
	include: ['session']
});

const providers = [{ provide: 'persistStorage', useValue: storage }];

platformBrowserDynamic(providers).bootstrapModule(CoreModule)
  .catch(err => console.error(err));
