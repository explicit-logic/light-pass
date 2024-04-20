export function compareResponders(a: ResponderInterface, b: ResponderInterface) {
  if (!a.identified && !b.identified) {
    return 0;
  }

  if (!a.identified) {
    return -1;
  }

  if (a.name && b.name) {
    return compareText(a.name, b.name);
  }
  if (a.email && b.email) {
    return compareText(a.email, b.email);
  }

  if (a.identified && b.identified) {
    return 0;
  }

  return 1;
}

function compareText(a: string, b: string): number {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
