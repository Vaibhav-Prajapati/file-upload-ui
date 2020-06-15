import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
		constructor( props ) {
		super( props );
		this.state = {
			selectedFile: null,
			selectedFiles: null,
			error: null,
			errorText:null,
			success:null,
			successText:null
		}
	}

	singleFileChangedHandler = ( event ) => {
	
		this.setState({
		 selectedFile: event.target.files[0]
		});
	   };

	singleFileUploadHandler = ( event ) => {
		const data = new FormData();
	  // If file selected
		
		if ( this.state.selectedFile && this.state.selectedFile.size <= 5000000) {
			data.append( 'profileImage', this.state.selectedFile, this.state.selectedFile.name );
			axios.post( '/api/profile/profile-img-upload', data, {
				headers: {
				'accept': 'application/json',
				'Accept-Language': 'en-US,en;q=0.8',
				'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
				}
				})
		  	.then( ( response ) => {
					if ( 200 === response.status ) {
						// If file size is larger than expected.
						if( response.data.error ) {
							if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
								this.setState({
									error: true,
									success: false,
									errorText: "Maximum allowed size is 5 MB."
								});	 
							
							} else {
								// If not the given file type
								this.setState({
									error: true,
									errorText: response.data.error,
									success: false
								});	 
							}
						} else {
							// Success
							let fileName = response.data;
							this.setState({
								success: true,
								error: false,
								successText: "File uploaded successfully. The file path is " + fileName.location
							});	 
						}
					}
				}).catch( ( error ) => {
					this.setState({
						error: true,
						errorText: error,
						success: false
					});	 
				});
			} else {
			// if file not selected throw error
				if(this.state.selectedFile.size > 5000000){
					this.setState({
						error: true,
						success: false,
						errorText: "Maximum file size allowed is  5 MB."
					});
				}else{
					this.setState({
						error: true,
						errorText: "Please select file to upload.",
						success: false
					});
		
				}
							
			}
	  };   

	
	    
	render() {

		let errorDiv = ""
		if(this.state.error){
			errorDiv = <div>{ this.state.errorText} </div>
		}	

		let successDiv = ""
		if(this.state.success){
			successDiv = <div> {this.state.successText} 
			
			</div>
		}

		return(
			<div>
				{errorDiv}
				{successDiv}
				
				<div className="">
						<div className="">
							<p className="">Please upload an image for your profile</p>
							<input type="file" onChange={this.singleFileChangedHandler}/>
							<div className="mt-5">
							<button className="btn btn-info" onClick={this.singleFileUploadHandler}>Upload</button>
						</div>
					</div>
				</div>
		   </div>
		);
	}
}

export default Home;