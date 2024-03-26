import navConfig from './nav.config';
import langs from './i18n/route';

const LOAD_DOCS_MAP = {
    'zh-CN': path => {
        return r => require.ensure([], () =>
            r(require(`./docs/zh-CN${path}.md`)),
            'zh-CN');
    },
    'en-US': path => {
        return r => require.ensure([], () =>
            r(require(`./docs/en-US${path}.md`)),
            'en-US');
    }
};

const loadDocs = function (lang, path) {
    console.log(path,'path');
    return LOAD_DOCS_MAP[lang](path);
};

const registerRoute = (navConfig) => {
    const route = [];
    Object.keys(navConfig).forEach((lang, index) => {
        const navs = navConfig[lang];
        route.push({
            path: `/${lang}/docs`,
            redirect: `/${lang}/docs/changelog`,
            component: () => import('./components/main-layout'),
            children: []
        });
        navs.forEach(nav => {
            if (nav.href) return;
            if (nav.layout) {
                nav.component = () => import('./components/main-layout')
            }
            if (nav.groups) {
                nav.groups.forEach(group => {
                    group.list.forEach(nav => {
                        addRoute(nav, lang, index);
                    });
                });
            } else if (nav.children) {
                nav.children.forEach(nav => {
                    addRoute(nav, lang, index);
                });
            } else {
                addRoute(nav, lang, index);
            }
        });
    });
    function addRoute(page, lang, index) {
        const component = loadDocs(lang, page.path);
        let child = {
            path: page.path.slice(1),
            meta: {
                title: page.title || page.name,
                description: page.description,
                lang
            },
            name: 'component-' + lang + (page.title || page.name),
            component: component.default || component
        };

        route[index].children.push(child);
    }

    return route;
};

let route = registerRoute(navConfig);

const generateMiscRoutes = function (lang) {
    let indexRoute = {
        path: `/${lang}`, // 首页
        meta: { lang },
        name: 'home' + lang,
        component: loadDocs(lang, `/index`)
    };

    return [
        indexRoute
    ];
};

langs.forEach(lang => {
    route = route.concat(generateMiscRoutes(lang.lang));
});


let userLanguage = localStorage.getItem('ELEMENT_LANGUAGE') || window.navigator.language || 'zh-CN';
let defaultPath = '/zh-CN';
if (userLanguage.indexOf('zh-') !== -1) {
    defaultPath = '/zh-CN';
} else {
    defaultPath = '/en-US';
}

route = route.concat([{
    path: '/',
    redirect: defaultPath
}, {
    path: '*',
    redirect: defaultPath
}]);
console.log(route,'route');
export default route;
