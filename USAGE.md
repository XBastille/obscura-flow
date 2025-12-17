# How to Use ObscuraFlow

A quick guide to building neural network architectures and exporting PyTorch code.

---

## Interface

| Section | Location | Purpose |
|---------|----------|---------|
| **Layer Palette** | Left | Drag layers onto the canvas |
| **Canvas** | Center | Build and connect your network |
| **Property Inspector** | Right | Configure layer parameters |

---

## Basic Workflow

1. **Drag an Input layer** onto the canvas and set your tensor shape (C, H, W)
2. **Add layers** by dragging from the left palette
3. **Connect layers** by dragging from the bottom handle of one node to the top of another
4. **Configure parameters** by clicking a layer and editing values in the right panel
5. **Export** by clicking "Export Code" to get your PyTorch `nn.Module`

---

## Example: Simple CNN

Build this CIFAR-10 style classifier:

```
Input [3, 32, 32]
  → Conv2D (16 filters, k=3, p=1) → [16, 32, 32]
  → ReLU
  → MaxPool (k=2, s=2) → [16, 16, 16]
  → Conv2D (32 filters, k=3, p=1) → [32, 16, 16]
  → ReLU
  → MaxPool (k=2, s=2) → [32, 8, 8]
  → Flatten → [2048]
  → Linear (128 out)
  → ReLU
  → Dropout (0.5)
  → Linear (10 out)
```

**Steps:**
1. Add `Input` with shape `[3, 32, 32]`
2. Add `Conv2D` → set Out Channels=16, Kernel=3, Padding=1
3. Add `ReLU` → connect
4. Add `MaxPool` → Kernel=2, Stride=2
5. Add `Conv2D` → Out Channels=32, Kernel=3, Padding=1
6. Add `ReLU` → connect
7. Add `MaxPool` → Kernel=2, Stride=2
8. Add `Flatten` → connect
9. Add `Linear` → Out Features=128
10. Add `ReLU`, `Dropout` (p=0.5), `Linear` (Out Features=10)
11. Click **Export Code**

---

## Layer Parameters

| Layer | Key Parameters |
|-------|----------------|
| **Input** | Shape: C, H, W |
| **Conv2D** | Out Channels, Kernel, Stride, Padding |
| **MaxPool2D** | Kernel, Stride |
| **Linear** | Out Features (input auto-inferred) |
| **Dropout** | Probability (p) |

> **Tip:** Use `Flatten` before `Linear` when coming from Conv layers.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Shape shows `?` | Check layer parameters are valid |
| Linear shows `Invalid` | Add `Flatten` before `Linear` |
| No code generated | Ensure `Input` layer is connected |
