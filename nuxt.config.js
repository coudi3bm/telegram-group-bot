export default {
    target: 'server',
    render: {
        ssr: true,
    },
    head: {
        title: 'telegram-group-bot',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
        ],
        link: [
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
        ]
    },
    css: [
        '~/css/main.scss',
        'roboto-fontface/css/roboto/roboto-fontface.css'
    ],
    components: [{ path: '~/components', pathPrefix: false }],
    buildModules: [
        '@nuxtjs/vuetify',
    ],
    modules: [
        '@nuxtjs/axios',
        'cookie-universal-nuxt',
    ],
    plugins: [
        '~/plugins/notifier.js',
        '~/plugins/auth.js',
    ],
    vuetify: {
        defaultAssets: false,
        icons: {
            iconfont: 'mdiSvg',
        },
        theme: {
            dark: false,
            options: { customProperties: true },
            themes: {
                light: {
                    primary: '#2979FF',
                    header: '#FFFFFF',
                    headerBorder: '#E0E0E0',
                    content: '#FFFFFF',
                    content2: '#FDFDFD',
                    background1: '#F4F4F4',
                    background2: '#FAFAFA',
                    icon: '#707070',
                    icon2: '#212121',
                    scrollBackground: '#FFFFFF',
                    scrollBorder: '#F2F2F2',
                    scrollThumbBackground: '#EAEAEA',
                    scrollThumbBackgroundHover: '#E5E5E5',
                    scrollThumbBackgroundActive: '#CCCCCC',
                },
                dark: {
                    primary: '#82B1FF',
                    header: '#1D1D1D',
                    headerBorder: '#383838',
                    content: '#1D1D1D',
                    content2: '#181818',
                    background1: '#0E0E0E',
                    background2: '#121212',
                    icon: '#FFFFFF',
                    icon2: '#FFFFFF',
                    scrollBackground: '#191919',
                    scrollBorder: '#1B1B1B',
                    scrollThumbBackground: '#2f2f2f',
                    scrollThumbBackgroundHover: '#333333',
                    scrollThumbBackgroundActive: '#4A4A4A',
                }
            }
        }
    },
    axios: {
        proxy: true,
    },
    serverMiddleware: [
        '~/api/index.js'
    ],
    server: {
        port: 3000,
        host: '0.0.0.0'
    },
    publicRuntimeConfig: {},
    privateRuntimeConfig: {},
    build: {}
}