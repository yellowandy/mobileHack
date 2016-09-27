/*
 * Your installation or use of this SugarCRM file is subject to the applicable
 * terms available at
 * http://support.sugarcrm.com/Resources/Master_Subscription_Agreements/.
 * If you do not agree to all of the applicable terms or do not have the
 * authority to bind the entity as an authorized representative, then do not
 * install or use this SugarCRM file.
 *
 * Copyright (C) SugarCRM Inc. All rights reserved.
 */

//Each route can be declared like this (see also routes.js for additional documentation):
//{
//    name: "route name",                 // required for Backbone router. Also is used as a step name for simple step declaration form. See steps declaration section below.
//    getScreenOptions: function() {},    // function that converts url parameters to screen options object. Usually its result is consumed by controller.loadScreen.
//    handler: function() {},             // If handler function is not specified then handler function is created like a getScreenOptions wrapper
//                                        // It calls controller.loadScreen with getScreenOptions result.
//                                        // If handler fn is specified then it is called directly.

//    Route steps declaration can be detailed or simple.
//    Route steps are concatenated to get full route url pattern.
//      1) Detailed form
//          steps: [{                           // route steps list. One route can be used for loading several screens (like detail and edit).
//              name: 'step name',              // unique step name
//              url: ':module/:modelId',        // url pattern, Backbone route format
//              skipTrack: true,                // flag indicating that the step should not be tracked by history. Such steps are not stored in visited history items.
//         ],
//
//      2) Simple form of steps
//          steps: ':module',                   // if route contains just one step then a simple form can be used. In this case skipTrack options should be declared at the same level.
//}

var app = SUGAR.App;
var customization = require('%app.core%/customization');
var pandaLayouts = require('./views/panda/panda-layout');
var ptrLayout = require('./views/ptr/ptr-layout');

// static route does not have parameters, matching url hash is #StaticPanda.
var staticRoute = {
    // Backbone route name. See Backbone router documentation for details.
    // In case of simple steps declaration (steps property is a string) also used as a step name
    // and must be unique across application step names.
    name: 'static-panda',

    // steps parameter simple declaration. In this case steps string equals location.hash directly.
    steps: 'StaticPanda',
    handler: function() {
        alert('Welcome to PandaCRM');
    },
};

// static route used to open tab container view sample.
var tabbedViewRoute = {
    name: 'tabbed-panda',
    steps: 'Panda/TabbedPanda',
    handler: function() {
        app.controller.loadScreen({ layouts: [pandaLayouts.PandaTabsLayout] });
    },
};

var todoRoute = {
    name: 'todo-list',
    steps: 'todos',
    handler: function() {
        var TodoListLayout = require('./views/todos/todo-layout');
        app.controller.loadScreen({ layouts: [TodoListLayout] });
    },
};

var ptrRoute = {
    name: 'ptr-custom',
    steps: 'ptr-custom',
    handler: function() {
        app.controller.loadScreen({ layouts: [ptrLayout] });
    },
};

// route has one dynamic parameter "pandaName", matching url hash is #PandaProfile/LittlePanda or #PandaProfile/PinkPanda.
var oneStepRoute = {
    name: 'panda-profile',
    steps: 'PandaProfile/:profileName',
    getScreenOptions: function(name) { // this method creates screen options object from url parameter, result usually consumed by controller.loadScreen method.
        return {
            // if up navigation is required for the step
            // then object key "pandaName" must be equal to step url ":pandaName" (w/o colon).
            // See up navigation example below.
            profileName: name,
            isPandaProfileRoute: true,
        };
    },

    handler: function(screenOptions) {
        _.extend(screenOptions, {
            layouts: [pandaLayouts.PandaDetailLayout],
        });

        //This is an example of the simplest way to load layouts. Just provide constructor references to 'layout' property
        app.controller.loadScreen(screenOptions);
    },
};

// One url may be used to load multiple application screens. For example list view and details view.
// In the following example route handles urls like #Panda/KungFu/Po, where
// "#Panda/KungFu" part is used to show a list of KungFu pandas and
// "#Panda/KungFu/Po" part is used to show details view of panda named Po.
var twoStepsRoute = {
    name: 'two-steps-panda',

    // note that steps is array here. Internal logic iterates through all steps
    // and builds url patterns matching each individual step.
    steps: [
        {
            // First step name (List view), step name must be unique.
            name: 'panda-list',

            // location.hash matching the first step, Eg. #Panda/KungFu
            url: 'Panda/:pandaType',
        }, {
            // second step name (Details view)
            name: 'panda-detail',

            // optional step (in parenthesis). See Backbone routes declaration syntax.
            // location.hash matching the second step, Eg. #Panda/KungFu/Po
            url: '(/:pandaName)',
        },
    ],

    // For the first step method returns { pandaType: "KungFu" }
    // For the second step method returns { pandaType: "KungFu", pandaName: "Po" }
    getScreenOptions: function(pandaType, name) {
        return {
            pandaType: pandaType,
            pandaName: name,
        };
    },

    handler: function(screenOptions) {
        var layouts = [];
        if (screenOptions.pandaType) {
            layouts.push(pandaLayouts.PandaListLayout);
        }

        if (screenOptions.pandaName) {
            layouts.push(pandaLayouts.PandaDetailLayout);
        }

        screenOptions.layouts = layouts;

        //2 layouts will be loaded in tabled landscape mode
        //on phone and in tablet portait mode SECOND layout is always used. This is default Nomad behavior
        app.controller.loadScreen(screenOptions);
    },
};

// Steps support additional configuration options. For simple routes (steps property is a string)
// these options are declared on route object level, for complex routes (steps property is an array)
// options are declared at each step object level.
var advancedOptionsRoute = {
    name: 'advanced-route',
    steps: [
        {
            name: 'not-tracked-step',
            url: 'AdvancedPanda/:firstParam',

            // skipTrack parameter indicates if the step is not tracked in history and unavailable for "back" navigation.
            skipTrack: true,
        }, {
            name: 'unsecure-step',
            url: '(/:secondParam)',

            // isUnsecure parameter indicates if step is available for not authenticated users.
            isUnsecure: true,
        },
    ],
    getScreenOptions: function(firstParam, secondParam) {
        return {
            isUnsecure: !!secondParam,
            isNotTracked: !!firstParam && !secondParam,
        };
    },

    handler: function(options) {
        if (options.isUnsecure) {
            alert('Unsecure step handler is called even on login view');
        } else {
            alert('This step will not be available after loading new step and pressing back button.');
        }
    },

    // In case if route has just one step and "steps" parameter is a string additional options are declared here.
};

/*
 * Up navigation tree.
 * It describes relations between steps for "up" navigation.
 * Notice that this is default parent-child relationships and they can differ in runtime depending on a context.
 * Default up navigation can be used when Nomad is started from a deep link to bring a user to home view step by step.
 * See examples for more details.
 *
 * In case when parent and child steps belong to different routes then child screen options may require conversion into parent's options.
 * mappedOptions property is used to describe a rule how to do it.
 * It can be a function or a mapping object.
 *
 * @example
 *
 *  // Object format is a tree where subnode is a child step for its parent.
 *  // In this case "action"'s up parent is "detail", and "detail"'s up step is "list".
 *  // It means the if Nomad is started with Accounts/Id/edit url, then by pressing Cancel button the user will see edit->detail->list views.
 *  list: {
 *      detail: {},
 *          action: {}
 *      }
 *  }
 *
 *  // Up step params mapping example
 *  mappedOptions: {
 *      // child's "parentDashboardId" will be used as parent's "dashboardId" options
 *      parentDashboardId: 'dashboardId',
 *      // child's "parentDashletId" will be used as parent's "dashletId" options
 *      parentDashletId: 'dashletId',
 *  },
 */
var upNavigationMap = {
    'panda-list': {
        // panda-details step is a child step for panda-list.
        'panda-detail': {
            // panda-profile is a child of panda-detail
            'panda-profile': {

                // panda-profile comes from another route and has different parameter names.
                // In this case we need to specify parameters mapping for building a correct url.
                mappedOptions: function(screenOptions) {
                    return {
                        pandaType: 'KungFu',
                        pandaName: screenOptions.profileName,
                    };
                },
            },
        },
    },
};

var customRoutes = [staticRoute, tabbedViewRoute, todoRoute, ptrRoute, oneStepRoute, twoStepsRoute, advancedOptionsRoute];

// registering custom routes
customization.registerRoutes(customRoutes, { upNavigationMap: upNavigationMap });
