'use strict';

const Subscription = require('./common');
const Asset = require('./asset');
const Namespace = require('./namespace');
const Search = require('./search');

module.exports = {
    ASSET: Subscription.ASSET,
    NAMESPACE: Subscription.NAMESPACE,
    SEARCH: Subscription.SEARCH,

    Asset_subscription: Asset,
    Namespace_subscription: Namespace,
    Search_subscription: Search,
};
