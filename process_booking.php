<?php
// process_booking.php - Process the booking form submissions

// Include database connection
require_once('db_connection.php');

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $phone = htmlspecialchars(trim($_POST['phone']));
    $event_type = htmlspecialchars(trim($_POST['event_type']));
    $event_date = htmlspecialchars(trim($_POST['event_date']));
    $guests = intval($_POST['guests']);
    $message = htmlspecialchars(trim($_POST['message']));
    $submission_date = date('Y-m-d H:i:s');
    $status = 'pending'; // Default status for new bookings

    // Validate essential data
    if (empty($name) || empty($email) || empty($phone) || empty($event_type) || empty($event_date) || $guests < 1) {
        // Redirect back with error
        header("Location: index.html?section=booking&error=1");
        exit;
    }

    // Insert into database
    $sql = "INSERT INTO bookings (name, email, phone, event_type, event_date, guests, message, submission_date, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssss", $name, $email, $phone, $event_type, $event_date, $guests, $message, $submission_date, $status);
    
    if ($stmt->execute()) {
        // Success - redirect with success message
        header("Location: index.html?section=booking&success=1");
    } else {
        // Error - redirect with database error
        header("Location: index.html?section=booking&error=2");
    }
    
    $stmt->close();
    $conn->close();
} else {
    // Not a POST request, redirect to main page
    header("Location: index.html");
}
?>

 

<?php
// subscribe.php - Process newsletter subscriptions

// Include database connection
require_once('db_connection.php');

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize email
    $email = htmlspecialchars(trim($_POST['newsletter_email']));
    $subscription_date = date('Y-m-d H:i:s');
    $status = 'active'; // Default status for new subscriptions

    // Validate email
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Redirect back with error
        header("Location: index.html?newsletter_error=1");
        exit;
    }

    // Check if email already exists
    $check_sql = "SELECT id FROM newsletter_subscribers WHERE email = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $check_stmt->store_result();
    
    if ($check_stmt->num_rows > 0) {
        // Email already subscribed - redirect with info message
        $check_stmt->close();
        header("Location: index.html?newsletter_info=1");
        exit;
    }
    $check_stmt->close();

    // Insert new subscriber
    $sql = "INSERT INTO newsletter_subscribers (email, subscription_date, status) 
            VALUES (?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $email, $subscription_date, $status);
    
    if ($stmt->execute()) {
        // Success - redirect with success message
        header("Location: index.html?newsletter_success=1");
    } else {
        // Error - redirect with database error
        header("Location: index.html?newsletter_error=2");
    }
    
    $stmt->close();
    $conn->close();
} else {
    // Not a POST request, redirect to main page
    header("Location: index.html");
}
?>
