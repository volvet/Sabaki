const {h, Component} = require('preact')
const classNames = require('classnames')
const {remote} = require('electron')

const TextSpinner = require('../TextSpinner')

const t = require('../../i18n').context('PlayBar')
const helper = require('../../modules/helper')
const setting = remote.require('./setting')

class PlayBar extends Component {
    constructor() {
        super()

        this.handleCurrentPlayerClick = () => this.props.onCurrentPlayerClick

        this.handleMenuClick = () => {
            let {left, top} = this.menuButtonElement.getBoundingClientRect()
            helper.popupMenu([
                {
                    label: t('&Pass'),
                    click: () => sabaki.makeMove([-1, -1])
                },
                {
                    label: t('&Resign'),
                    click: () => sabaki.makeResign()
                },
                {type: 'separator'},
                {
                    label: t('Es&timate'),
                    click: () => sabaki.setMode('estimator')
                },
                {
                    label: t('&Score'),
                    click: () => sabaki.setMode('scoring')
                },
                {
                    label: t('&Edit'),
                    click: () => sabaki.setMode('edit')
                },
                {
                    label: t('&Find'),
                    click: () => sabaki.setMode('find')
                },
                {type: 'separator'},
                {
                    label: t('&Info'),
                    click: () => sabaki.openDrawer('info')
                }
            ], left, top)
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.mode !== this.props.mode || nextProps.mode === 'play'
    }

    render({
        mode,
        playerNames,
        playerRanks,
        playerCaptures,
        currentPlayer,
        showHotspot,

        onCurrentPlayerClick = helper.noop
    }) {
        let captureStyle = index => ({opacity: playerCaptures[index] === 0 ? 0 : .7})

        return h('header',
            {
                class: classNames({
                    hotspot: showHotspot,
                    current: mode === 'play'
                })
            },

            h('div', {class: 'hotspot', title: t('Hotspot')}),

            h('span', {class: 'playercontent player_1'},
                h('span', {class: 'captures', style: captureStyle(0)}, playerCaptures[0]), ' ',

                playerRanks[0] && h('span',
                    {class: 'rank'},
                    t(p => p.playerRank, {
                        playerRank: playerRanks[0]
                    })
                ), ' ',

                h('span',
                    {
                        class: 'name'
                    },
                    playerNames[0] || t('Black')
                )
            ),

            h('a',
                {
                    class: 'current-player',
                    title: t('Change Player'),
                    onClick: onCurrentPlayerClick
                },
                h('img', {
                    src: `./img/ui/player_${currentPlayer}.svg`,
                    height: 21,
                    alt: t(p =>
                        `${
                            p.player < 0 ? 'White'
                            : p.player > 0 ? 'Black'
                            : p.player
                        } to play`,
                        {player: currentPlayer}
                    )
                })
            ),

            h('span', {class: 'playercontent player_-1'},
                h('span',
                    {
                        class: 'name'
                    },
                    playerNames[1] || t('White'),
                ), ' ',

                playerRanks[1] && h('span',
                    {class: 'rank'},
                    t(p => p.playerRank, {
                        playerRank: playerRanks[1]
                    })
                ), ' ',

                h('span', {class: 'captures', style: captureStyle(1)}, playerCaptures[1])
            ),

            h('a',
                {
                    ref: el => this.menuButtonElement = el,
                    class: 'menu',
                    onClick: this.handleMenuClick
                },
                h('img', {src: './node_modules/octicons/build/svg/three-bars.svg', height: 22})
            )
        )
    }
}

module.exports = PlayBar
