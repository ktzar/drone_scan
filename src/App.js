import React from 'react';
import logo from './logo.svg';
import './App.css';

const SERVICE_URL = 'https://bobs-epic-drone-shack-inc.herokuapp.com/api/v0/drones';

const ErrorBanner = props => <div style={{color: 'white', background: 'red'}}>{props.children}</div>

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            drones: [],
            range: [0, 100]
        };
    }

    setRange = (rangeEnd, value) => {
        const currRange = this.state.range;
        if (rangeEnd === 'min') {
            currRange[0] = parseInt(value);
        } else if (rangeEnd === 'max') {
            currRange[1] = parseInt(value);
        }
        if (currRange[0] < currRange[1]) {
            this.setState({range: currRange});
        }
    }

    fetchDrones() {
        fetch(SERVICE_URL)
            .then(d => d.json())
            .then(droneData => {
                this.setState({
                    drones: droneData
                });
            })
            .catch(err => console.error('Could not get drone data. Will try again'));
    }

    componentDidMount() {
        this.fetchDrones();
        this.intervalHandler = setInterval(this.fetchDrones.bind(this), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalHandler);
    }

    render() {
      return (
        <div className="App">
            <h2>List of drones</h2>
            <section>
                Filter by range for success:
                Min <input value={this.state.range[0]} onChange={evt => this.setRange('min', evt.target.value)} type="range" min="0" oax="100" /><br/>
                Max <input value={this.state.range[1]} onChange={evt => this.setRange('max', evt.target.value)} type="range" min="0" max="100" /><br/>
                {this.state.range[1] < this.state.range[0] && <ErrorBanner>Max should be more than min</ErrorBanner>}
            </section>
            <section>
                {this.state.drones.length
                    ?  this.state.drones
                        .filter(d => {
                            if (d.numFlights === 0 ) {return true;}

                            const successRate = 100 * (d.numCrashes / d.numFlights);
                            return successRate >= this.state.range[0] &&
                                successRate <= this.state.range[1];
                        })
                        .map(d => <div key={d.droneId}>{d.name}</div>)
                    : 'No information yet, hang on tight'
                }
            </section>
        </div>
      );
    }
}

export default App;
