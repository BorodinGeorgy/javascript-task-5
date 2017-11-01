'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    let allEvents = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!(event in allEvents)) {
                allEvents[event] = [];
            }
            allEvents[event].push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            [event].concat(Object.keys(allEvents).filter(e => e.startsWith(event + '.')))
                .forEach(filteredEvent => {
                    allEvents[filteredEvent] = allEvents[filteredEvent]
                        .filter(x => x.context !== context);
                });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let parts = event.split('.');
            while (parts.length) {
                event = parts.join('.');
                if (allEvents[event]) {
                    allEvents[event].forEach(x => x.handler.call(x.context));
                }
                parts.pop();
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                this.on(event, context, handler);
            }
            let eventCounter = times;
            this.on(event, context, function () {
                if (eventCounter > 0) {
                    handler.call(context);
                }
                eventCounter--;
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                this.on(event, context, handler);
            }

            let eventCounter = 0;

            this.on(event, context, function () {
                if (eventCounter % frequency === 0) {
                    handler.call(context);
                }
                eventCounter++;
            });

            return this;
        }
    };
}

