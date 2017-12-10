import React, { Component } from 'react'
import HighChart from 'react-highcharts'
import $ from 'jquery'
import DatePicker from 'react-datepicker'
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '../style.css'

class App extends Component {
	constructor(props) {
			super()
			this.state = {
				interval: [],
				hits_count: [],
				urls: "",
				before_date: null,
				after_date: null
			}
	}

	handleSubmit(e) {
		debugger
		e.preventDefault()
		$.ajax({
			url: 'http://localhost:3001/page_views',
			data: {
				urls: this.state.urls,
				before_date: this.state.before_date.toDate(),
				after_date: this.state.after_date.toDate()
			},
			error: function() {

			},
			success: function(data) {
				this.setState({
					interval: data.interval,
					hits_count: data.hits_count
				})
			}.bind(this)
		})
	}

	handleBeforeDate(date) {
		this.setState({
			before_date: date
		})
	}

	handleAfterDate(date) {
		this.setState({
			after_date: date
		})
	}

	handleInputChange(e) {
		this.setState({
			urls: e.target.value
		})
	}

	chartConfig() {
		return (
			{
			  chart: {
			      type: 'column'
			  },
			  title: {
			      text: 'Stacked column chart'
			  },
			  yAxis: {
			      min: 0,
			      title: {
			          text: 'Count'
			      },
			      stackLabels: {
			          enabled: true,
			          style: {
			              fontWeight: 'bold',
			              color: (HighChart.theme && HighChart.theme.textColor) || 'gray'
			          }
			      }
			  },
			  legend: {
			      align: 'right',
			      x: -30,
			      verticalAlign: 'top',
			      y: 25,
			      floating: true,
			      backgroundColor: (HighChart.theme && HighChart.theme.background2) || 'white',
			      borderColor: '#CCC',
			      borderWidth: 1,
			      shadow: false
			  },
			  tooltip: {
			      headerFormat: '<b>{point.x}</b><br/>',
			      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
			  },
			  plotOptions: {
			      column: {
			          stacking: 'normal',
			          dataLabels: {
			              enabled: true,
			              color: (HighChart.theme && HighChart.theme.dataLabelsColor) || 'white'
			          }
			      }
			  },
			  xAxis: {
			      categories: this.state.interval
			  },
			  series: this.state.hits_count
			}
		)
	}

	formValid() {
		return this.state.before_date && this.state.after_date
	}

	render() {
		return(
			<div className="container">
				<div className="row">
					<br/>
					<div className="col-lg-12 data-filter">
						<form className="form-inline" onSubmit={ (e) => this.handleSubmit(e) }>
							  <div className="form-group col-sm-5">
							    <input 
							    	type="text"
							    	value={ this.state.urls }
							    	className="form-control urls-field"
							    	placeholder="Enter URLs (seperate by comma)"
							    	onChange={ (e) => this.handleInputChange(e) }
							    />
							  </div>
								 <div className="col-sm-2">
								  <DatePicker
					          onChange={ this.handleBeforeDate.bind(this) }
					          placeholderText="Before date"
					          selected={ this.state.before_date }
					          className="form-control"
					        />
					       </div>
					       <div className="col-sm-3">
								  <DatePicker
					          onChange={ this.handleAfterDate.bind(this) }
					          selected={ this.state.after_date }
					          placeholderText="After date"
					          className="form-control"
					        />
					       </div>
							  <input type="submit" value="Submit" className="btn btn-primary" disabled={!this.formValid()} />
							</form>
					</div>
					<div className="col-lg-12">
						<HighChart config={ this.chartConfig() } />
					</div>
				</div>
			</div>
		)
	}
}

export default App;