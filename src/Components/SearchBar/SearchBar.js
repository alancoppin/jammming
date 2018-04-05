import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      searchTerm :'',
    }

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search(){
    if(this.props.spotify()){
      this.props.onSearch(this.state.searchTerm);
    }else{
      this.props.spotify();
    }
  }

  handleTermChange(event){
    this.setState({searchTerm:event.target.value})
  }


  render(){
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
