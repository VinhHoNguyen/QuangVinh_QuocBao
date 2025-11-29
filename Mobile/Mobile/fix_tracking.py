import re

# Read the file
with open('src/screen/TrackingScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the old function
old_function = '''  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Chờ xác nhận', icon: 'time-outline' },
      { key: 'confirmed', label: 'Đã xác nhận', icon: 'checkmark-circle-outline' },
      { key: 'preparing', label: 'Đang chuẩn bị', icon: 'restaurant-outline' },
      { key: 'delivering', label: 'Đang giao hàng', icon: 'airplane-outline' },
      { key: 'delivered', label: 'Đã giao', icon: 'checkmark-done-circle' },
    ];

    const currentIndex = steps.findIndex(s => s.key === order?.status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };'''

# Define the new function
new_function = '''  const getStatusSteps = () => {
    // 3-stage timeline: Chờ xác nhận → Đang giao → Đã giao
    const steps = [
      { key: 'pending', label: 'Chờ xác nhận', icon: 'time-outline' },
      { key: 'delivering', label: 'Đang giao', icon: 'airplane-outline' },
      { key: 'delivered', label: 'Đã giao', icon: 'checkmark-done-circle' },
    ];

    // Map backend statuses to mobile stages
    // Backend: pending, confirmed, preparing → Mobile: 'pending' (Chờ xác nhận)
    // Backend: delivering → Mobile: 'delivering' (Đang giao)
    // Backend: delivered → Mobile: 'delivered' (Đã giao)
    let currentStage = 'pending';
    if (order?.status === 'delivered') {
      currentStage = 'delivered';
    } else if (order?.status === 'delivering') {
      currentStage = 'delivering';
    }
    // pending, confirmed, preparing stay as 'pending' stage

    const currentIndex = steps.findIndex(s => s.key === currentStage);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };'''

# Replace
content = content.replace(old_function, new_function)

# Write back
with open('src/screen/TrackingScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully updated getStatusSteps function!')
