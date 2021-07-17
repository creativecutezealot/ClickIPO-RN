import TradierApi from './TradierApi'
import Just2TradeApi from './Just2TradeApi'
import TradeStationApi from './TradeStationApi'


const brokerageSelector = (broker) => {
	if(broker.name === 'Tradier'){
		return TradierApi.create(broker)
	} else if(broker.name === 'Just2Trade') {
		return Just2TradeApi.create(broker)
	} else if(broker.name === 'TradeStation') {
		return TradeStationApi.create(broker)
	}
}

export default brokerageSelector