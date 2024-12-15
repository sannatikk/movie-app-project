import { render, screen, fireEvent } from '@testing-library/react'  // functions to render the component and interact with it
import { UseUser } from '../context/UseUser.js'                     // context to mock it
import NavigationBar from '../components/navbar/NavigationBar.js'          // component to test
import { BrowserRouter as Router } from 'react-router-dom'          // these are used to wrap the components in the Router

// instead of using the real useuser context, we mock it to simulate different states of the user
jest.mock('../context/UseUser', () => ({
  UseUser: jest.fn(),
}))

describe('Logout from NavBar', () => {
  it('should call logout and clear user data when logout button is clicked', () => {

    // mocking the UseUser hook for logged-in state
    const mockLogout = jest.fn()                        // this simulates the logout function without actually calling it
    const mockUseUserReturn = {
      user: { id: '1', username: 'testuser' },          // simulating a logged-in user
      token: 'some-token',                              // simulating the user's token
      logout: mockLogout,                               // simulating the logout function
    }

    // Initial mock return value for logged-in user
    UseUser.mockReturnValue(mockUseUserReturn)          // this tells jest to return the mock data when UseUser is called in the test

    // Render the component with the mocked context
    render(
      <Router>
        <NavigationBar />
      </Router>
    )

    // Simulate clicking the "Logout" button
    const logoutButton = screen.getByText('Logout')     // get the button element by its text content
    fireEvent.click(logoutButton)                       // simulate a click on the button

    // Verify that the logout function was called once with no parameters
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockLogout).toHaveBeenCalledWith()

    // Update the mock to simulate cleared state after logout
    mockUseUserReturn.user = { id: null, username: '' }
    mockUseUserReturn.token = null
    UseUser.mockReturnValueOnce(mockUseUserReturn)      // this tells jest to return the updated mock data when UseUser is called again in the test

    // Re-render the component to reflect the updated context
    render(
      <Router>
        <NavigationBar />
      </Router>
    )

    // Verify that the user data is cleared
    expect(UseUser().user.id).toBeNull()
    expect(UseUser().user.username).toBe('')
    expect(UseUser().token).toBeNull()
    // Verify that the component reflects the cleared state
    expect(screen.queryByText('Logout')).toBeNull()   // logout button should not appear


  })
})

// NOTE: to run frontend tests, run `npm test` in the frontend directory in the terminal
// - all frontend tests will run and output to the terminal
// - tests will run in watch mode by default, so they will automatically re-run when files are changed
// - to exit watch mode, press `q` in the terminal