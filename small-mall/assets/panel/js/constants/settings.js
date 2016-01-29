/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:38 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .constant('SETTINGS', {
        environment: ENVIRONMENT,

        templatesUrl: '/assets/panel/templates/',
        apiUrl: API_URL,

        isFluid: true,
        useHash: false,

        applicationName: 'Small Mall',

        dateJsonFormat: 'YYYY-MM-DD',
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        datePublicFormat: 'd MMM yyyy \'at\' HH:mm:ss',

        dayCurrentString: moment().format('YYYY-MM-DD'),
        dayCurrent: moment().toDate(),
        weekStartCurrent: moment().subtract('days', 1).startOf('week').add('days', 1).toDate(),
        weekEndCurrent: moment().subtract('days', 1).endOf('week').add('days', 1).toDate(),
        monthStartCurrent: moment().startOf('month').toDate(),
        monthEndCurrent: moment().endOf('month').toDate(),

        startUrl: '/mall/great-mall',
        startService: 'mall',
        startMethod: 'great-mall'
    });