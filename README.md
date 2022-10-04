# Website

## Getting Started

1. Run yarn to install all dependencies: `yarn`
2. Download and sync staging data: `yarn load-data`
3. Run development server `yarn dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.ou edit the file.


## Common tasks

### Updating algolia

Algolia indexes are only updated if the `UPDATE_ALGOLIA` environment variable is set. This is not the case by default.

```shell
UPDATE_ALGOLIA=1 yarn dev
UPDATE_ALGOLIA=1 yarn build:prod
// etc.
```

You can see this in action in the `bitbucket-pipelines.yml` file.

### Connecting to local BAPI and CAPI

By default the website will connect to our staging environment.

```
# .env
NEXT_PUBLIC_BOOKINGAPI_HOST=https://bookingapi.staging.swissactivities.com
NEXT_PUBLIC_CONTENTAPI_HOST=https://contentapi.staging.swissactivities.com
```

You can create a `.env.local` file with the following content to connect to local instances of BAPI and CAPI:

```
# .env.local
NEXT_PUBLIC_BOOKINGAPI_HOST=http://localhost:4006
NEXT_PUBLIC_CONTENTAPI_HOST=http://localhost:1337
```

**Attention:** Keep in mind that you'll have to run `yarn load-data` again after changing the CAPI host.