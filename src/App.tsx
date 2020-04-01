import React, { useState, useEffect } from "react";
import { MDBCol, MDBContainer, MDBRow, MDBNavbar, MDBNavbarBrand } from "mdbreact";
import { state, defaultState } from './types';
import DetailView from './DetailView';
import Card from './Card';

export interface AppProps { states: [state]; }
export interface AppState { states: [state]; }

const App = (props: AppProps) => {

  const [currentStates, setStates] = useState({ states: [defaultState()] });
  const [currentState, setState] = useState(defaultState());
  useEffect(() => {
    fetchAPI();
  }, []);

  let setActiveState = (e: any) => {
    const { id } = e.currentTarget;
    setState(currentStates.states[id]);
  }

  let hasASelectedResturant = (): boolean => {
    if (currentState === defaultState()) {
      return false;
    }
    return true;
  }

  //https://www.c-sharpcorner.com/blogs/generate-guid-using-javascript1
  let createGuid = () => {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
  }


  let fetchAPI = () => {

    fetch(
      'https://finnhub.io/api/v1/covid19/us?token=bq2ft1nrh5rb332ppnug'
    )
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        const sortedData = data.sort(function (a: state, b: state) { return b.case - a.case })
        setStates({ states: sortedData });
        setState({ ...sortedData[0] });
      })
      .catch(error => {
        console.log('Error occured on load.' + error);
      });
  }



  let divNumberLeft = "12";
  let divNumberRight = "0";

  if (hasASelectedResturant()) {
    divNumberLeft = "4";
    divNumberRight = "8";
  }

  return (

    <div className="App">
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol md="2"></MDBCol>
          <MDBCol md="8">
            <MDBNavbar className="white-text" style={{ position: 'relative', height: '50px', backgroundColor: "#43e895" }}>
              <MDBNavbarBrand style={{ position: 'absolute', left: '25%' }}>
                <strong>Current Corvid Numbers</strong>
              </MDBNavbarBrand>
            </MDBNavbar>

            <div style={{ overflowX: "hidden", overflowY: "scroll", maxHeight: "650px" }}>
              <div >
                <MDBRow>
                  <MDBCol md={divNumberLeft as any}>
                    {currentStates.states.map((item, index) => {
                      return <div key={createGuid()} id={index.toString()} onClick={setActiveState}>
                        <Card state={item} />
                      </div>;
                    })}
                  </MDBCol>
                  <MDBCol md={divNumberRight as any} className="pl-0">
                    <DetailView {...currentState} />
                  </MDBCol>
                </MDBRow>
              </div >
            </div>


          </MDBCol>
          <MDBCol md="2"></MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );

}

export default App;
