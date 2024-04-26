import navConfig from './nav.config';

/** 加载pages路径下的vue页面 */
/** 加载pages路径下的vue页面 */
const loadVue = (lang, path) => {
    return r => import(`./pages/${lang}/${path}.vue`)
        .then(module => r(module.default))
        .catch(error => console.error('加载vue页面出错', error));// eslint-disable-line
};

/** 加载docs路径下的MD文档 */
const loadDocs = (lang, path) => {
    return r => import(`./docs/${lang}${path}.md`)
        .then(module => r(module.default))
        .catch(error => console.error('加载文档出错', error));// eslint-disable-line
};

const registerRoute = (navConfig) => {
    const route = [];
    Object.keys(navConfig).forEach((lang, index) => {
        const navs = navConfig[lang];
        // 语言层
        route.push({
            path: `/${lang}`,
            name: 'home',
            redirect: `/${lang}/home`,
            component: () => import('./components/home-layout'),
            children: [
                {
                    path: `/${lang}/home`,
                    name: 'home-index',
                    component: loadVue(lang, 'home')
                }
            ]
        });
        navs.forEach((nav, pageIndex) => {
            if (nav.href) return;

            if (nav.layout) {
                // 大分类 
                route[index].children.push({
                    meta: {
                        title: nav.title || nav.name,
                        lang
                    },
                    path: `/${lang}${nav.path}`,
                    redirect: nav.redirect ? `/${lang}${nav.redirect}` : undefined,
                    component: () => import('./components/main-layout'),
                    children: []
                });
            }

            // 分组和小页面
            if (nav.groups) {
                nav.groups.forEach(group => {
                    group.list.forEach(nav => {
                        addRoute(nav, lang, index, pageIndex);
                    });
                });
            } else if (nav.children) {
                nav.children.forEach(nav => {
                    addRoute(nav, lang, index, pageIndex);
                });
            } else {
                addRoute(nav, lang, index, pageIndex);
            }
        });
    });
    function addRoute(page, lang, index, pageIndex) {
        const component = loadDocs(lang, page.path);
        let child = {
            path: `/${lang}` + page.path,
            meta: {
                title: page.title || page.name,
                description: page.description,
                lang
            },
            name: 'component-' + lang + (page.title || page.name),
            component: component.default || component
        };
        route[index].children[pageIndex + 1].children.push(child);
    }

    return route;
};

let route = registerRoute(navConfig);

const generateMiscRoutes = function (lang) {
    let indexRoute = {
        path: `/${lang}`, // 首页
        meta: { lang },
        name: 'home' + lang,
        component: loadVue(lang, `home`)
    };

    return [
        indexRoute
    ];
};

// langs.forEach(lang => {
//     route = route.concat(generateMiscRoutes(lang.lang));
// });


let userLanguage = localStorage.getItem('ELEMENT_LANGUAGE') || window.navigator.language || 'zh-CN';
let defaultPath = '/zh-CN';
if (userLanguage.indexOf('zh-') !== -1) {
    defaultPath = '/zh-CN';
} else {
    defaultPath = '/en-US';
}

route = route.concat([
    {
        path: '/',
        redirect: defaultPath
    }, 
    {
        path: '*',
        redirect: defaultPath
    },
    {
        path:'/demo',
        name:'demo',
        component:loadVue('zh-CN','demo')
    }
]);
console.log(route, 'route');
export default route;
